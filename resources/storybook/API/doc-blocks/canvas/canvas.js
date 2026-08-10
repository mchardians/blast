import { escapeHtml } from '../../../helpers/escapeHtml';
import { formatSourceCode } from '../../../helpers/formatSourceCode';

export const parseCanvas = (htmlString, context) => {
    if (!context.baseStoryId) return htmlString;

    const iconZoomIn = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
    const iconZoomOut = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
    const iconReset = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;

    return htmlString.replace(
        /\[render-canvas:(.*?)\]/gi,
        (match, argsString) => {
            const customArgs = {};
            if (argsString) {
                argsString.split(';').forEach((pair) => {
                    const [k, v] = pair.split(':');

                    if (k && v !== undefined) {
                        let val = decodeURIComponent(v.replace(/\+/g, ' '));
                        if (val === 'true') val = true;
                        if (val === 'false') val = false;
                        customArgs[k] = val;
                    }
                });
            }

            const finalArgs = { ...context.defaultArgs, ...customArgs };
            const escapedCode = escapeHtml(
                formatSourceCode(context.sourceCode, finalArgs)
            );

            return `
                <div class="sb-canvas-container">
                    <div class="sb-canvas-toolbar">
                        <button class="sb-toolbar-btn sb-zoom-in" title="Zoom In">${iconZoomIn}</button>
                        <button class="sb-toolbar-btn sb-zoom-out" title="Zoom Out">${iconZoomOut}</button>
                        <button class="sb-toolbar-btn sb-zoom-reset" title="Reset Zoom">${iconReset}</button>
                    </div>
                    <div class="sb-canvas-preview-area">
                        <iframe class="sb-inline-canvas" data-story="${context.baseStoryId}" src="iframe.html?id=${context.baseStoryId}&viewMode=story&args=${argsString}"></iframe>
                    </div>
                    <div class="sb-canvas-action-bar">
                        <button class="sb-toggle-code-btn">Show code</button>
                    </div>
                    <div class="sb-canvas-code-block" style="display: none;">
                        <pre><code>${escapedCode}</code></pre>
                        <button class="sb-copy-code-btn">Copy</button>
                    </div>
                </div>
            `;
        }
    );
};

export const initCanvasInteractivity = (canvasElement) => {
    const containers = canvasElement.querySelectorAll('.sb-canvas-container');
    containers.forEach((container) => {
        const iframe = container.querySelector('.sb-inline-canvas');
        const btnZoomIn = container.querySelector('.sb-zoom-in');
        const btnZoomOut = container.querySelector('.sb-zoom-out');
        const btnZoomReset = container.querySelector('.sb-zoom-reset');
        const btnToggleCode = container.querySelector('.sb-toggle-code-btn');
        const codeBlock = container.querySelector('.sb-canvas-code-block');
        const btnCopy = container.querySelector('.sb-copy-code-btn');
        const codeElement = container.querySelector('code');

        let currentScale = 1;
        const applyZoom = (scale) => {
            iframe.style.transform = `scale(${scale})`;
            iframe.style.transformOrigin = 'top left';
            iframe.style.width = `${100 / scale}%`;
        };

        if (btnZoomIn)
            btnZoomIn.addEventListener('click', () =>
                applyZoom((currentScale += 0.25))
            );
        if (btnZoomOut)
            btnZoomOut.addEventListener('click', () =>
                applyZoom((currentScale = Math.max(0.25, currentScale - 0.25)))
            );
        if (btnZoomReset)
            btnZoomReset.addEventListener('click', () =>
                applyZoom((currentScale = 1))
            );

        if (btnToggleCode && codeBlock) {
            btnToggleCode.addEventListener('click', () => {
                const isHidden = codeBlock.style.display === 'none';
                codeBlock.style.display = isHidden ? 'block' : 'none';
                btnToggleCode.textContent = isHidden
                    ? 'Hide code'
                    : 'Show code';
            });
        }

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
