import { parseTypography } from './typography/typography';
import { parseStory } from './story/story';
import { parseSource, initSourceInteractivity } from './source/source';
import { parseCanvas, initCanvasInteractivity } from './canvas/canvas';
import { parseControls, initControlsInteractivity } from './controls/controls';
import { initTOC } from './table-of-contents/toc';
import {
    parseIconGallery,
    initIconGalleryInteractivity
} from './icon-gallery/icon-gallery';

export const parseDocBlocks = (htmlString, context) => {
    let html = htmlString;
    html = parseTypography(html, context);
    html = parseCanvas(html, context);
    html = parseStory(html, context);
    html = parseControls(html);
    html = parseIconGallery(html);
    html = parseSource(html, context);
    return html;
};

export const mountDocBlocksInteractivity = (canvasElement, context) => {
    initCanvasInteractivity(canvasElement);
    initSourceInteractivity(canvasElement);
    initControlsInteractivity(canvasElement, context.argTypes);
    initIconGalleryInteractivity(canvasElement);

    const cleanupTOC = initTOC(canvasElement);

    return cleanupTOC;
};
