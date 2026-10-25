import { escapeHtml } from '../../../helpers/escapeHtml';
import { parseArgsString, serializeArgs } from '../../../helpers/args';
import { selectStory } from '../../../helpers/selectStory';

export const parseStory = (htmlString, context) => {
    if (!context.baseStoryId) return htmlString;

    return htmlString.replace(
        /\[render-story:(.*?)\]/gi,
        (match, argsString) => {
            const { story: storySlug, ...customArgs } =
                parseArgsString(argsString);
            const story = selectStory(context, storySlug);
            const iframeArgs = serializeArgs(customArgs);

            return `
                <div class="sb-story-container" style="margin: 2rem 0; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #f8fafc;">
                    <iframe
                        class="sb-inline-canvas"
                        data-story="${story.id}"
                        data-base-args="${escapeHtml(iframeArgs)}"
                        src="iframe.html?id=${story.id}&viewMode=story&args=${iframeArgs}"
                        style="border: none; width: 100%; min-height: 100px;">
                    </iframe>
                </div>
            `;
        }
    );
};
