import { escapeHtml } from '../../../helpers/escapeHtml';
import { formatSourceCode } from '../../../helpers/formatSourceCode';

export const parseSource = (htmlString, context) => {
    return htmlString.replace(/\[render-source\]/gi, () => {
        const formattedCode = formatSourceCode(
            context.sourceCode,
            context.defaultArgs
        );
        const escapedCode = escapeHtml(formattedCode);

        return `
            <div class="sb-canvas-code-block sb-standalone-source" style="margin: 2rem 0; border-radius: 0.5rem;">
                <pre><code>${escapedCode}</code></pre>
                <button class="sb-copy-code-btn">Copy</button>
            </div>
        `;
    });
};

export const initSourceInteractivity = (canvasElement) => {
    const blocks = canvasElement.querySelectorAll('.sb-standalone-source');
    blocks.forEach((block) => {
        const btnCopy = block.querySelector('.sb-copy-code-btn');
        const codeElement = block.querySelector('code');

        if (btnCopy && codeElement) {
            btnCopy.addEventListener('click', async () => {
                await navigator.clipboard.writeText(codeElement.textContent);
                const originalText = btnCopy.textContent;
                btnCopy.textContent = 'Copied!';
                setTimeout(() => (btnCopy.textContent = originalText), 2000);
            });
        }
    });
};
