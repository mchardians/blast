export const parseStory = (htmlString, context) => {
    if (!context.baseStoryId) return htmlString;

    return htmlString.replace(
        /\[render-story:(.*?)\]/gi,
        (match, argsString) => {
            return `
                <div class="sb-story-container" style="margin: 2rem 0; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #f8fafc;">
                    <iframe
                        class="sb-inline-canvas"
                        data-story="${context.baseStoryId}"
                        src="iframe.html?id=${context.baseStoryId}&viewMode=story&args=${argsString}"
                        style="border: none; width: 100%; min-height: 100px;">
                    </iframe>
                </div>
            `;
        }
    );
};
