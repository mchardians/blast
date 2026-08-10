import '../public/main.css';
import { themes } from '@storybook/theming';
import theme from './theme';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { DEFENSIVE_CSS } from '../resources/storybook/utilities/styles';
import {
    parseDocBlocks,
    mountDocBlocksInteractivity
} from '../resources/storybook/API/doc-blocks';

let setDocsTheme = (configDocsTheme) => {
    if (configDocsTheme === 'dark') {
        return themes.dark;
    } else if (configDocsTheme === 'custom') {
        return theme;
    } else {
        return themes.normal;
    }
};

const parseEnv = (key, fallback) => {
    try {
        const val = process.env[key];
        const parsed = val ? JSON.parse(val) : fallback;

        return parsed;
    } catch (e) {
        console.error(`[Storybook Debug] Failed to parsing ${key}:`, e);
        return fallback;
    }
};

const customViewports = parseEnv('STORYBOOK_VIEWPORTS', {});
const expandedControls = parseEnv('STORYBOOK_EXPANDED_CONTROLS', true);
const serverUrl = process.env.STORYBOOK_SERVER_URL || '';
const statusesConfig = parseEnv('STORYBOOK_STATUSES', {});
const docsTheme = parseEnv('STORYBOOK_DOCS_THEME', 'normal');
const globalTypes = parseEnv('STORYBOOK_GLOBAL_TYPES', {});

const preview = {
    parameters: {
        viewport: {
            viewports: customViewports
        },
        controls: {
            expanded: expandedControls
        },
        server: {
            url: serverUrl
        },
        layout: 'centered',
        status: {
            statuses: statusesConfig
        },
        docs: {
            inlineStories: false,
            renderer: async () => {
                let isMounted = true;
                let tocObserver = null;

                return {
                    render: async (
                        docsContext,
                        docsParameter,
                        canvasElement
                    ) => {
                        const rawMarkdown =
                            docsParameter?.description?.component || '';
                        const stories =
                            typeof docsContext.componentStories === 'function'
                                ? docsContext.componentStories()
                                : [];

                        let componentId = '';
                        const urlId = new URLSearchParams(
                            window.location.search
                        ).get('id');

                        if (urlId) {
                            componentId = urlId.split('--')[0];
                        } else if (stories.length > 0 && stories[0].title) {
                            componentId = stories[0].title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '');
                        } else {
                            componentId = 'fallback-component';
                        }

                        const storyNameSlug =
                            stories.length > 0 && stories[0].name
                                ? stories[0].name
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, '-')
                                : 'default';

                        const context = {
                            baseStoryId: `${componentId}--${storyNameSlug}`,
                            title:
                                stories.length > 0
                                    ? stories[0].name
                                    : 'Component',
                            description:
                                stories.length > 0
                                    ? stories[0]?.parameters?.docs?.description
                                          ?.component
                                    : '',
                            sourceCode:
                                stories.length > 0
                                    ? stories[0]?.parameters?.docs?.source
                                          ?.code || ''
                                    : '',
                            defaultArgs:
                                stories.length > 0
                                    ? stories[0]?.args || {}
                                    : {},
                            argTypes: stories[0]?.argTypes || {}
                        };

                        let htmlContent = await marked.parse(rawMarkdown);
                        htmlContent = parseDocBlocks(htmlContent, context);

                        if (!isMounted) return;

                        const cleanHtml = DOMPurify.sanitize(htmlContent, {
                            ADD_TAGS: [
                                'iframe',
                                'button',
                                'svg',
                                'path',
                                'circle',
                                'line',
                                'polyline',
                                'pre',
                                'code',
                                'h1',
                                'h3',
                                'p',
                                'select',
                                'option',
                                'input',
                                'table',
                                'thead',
                                'tbody',
                                'tr',
                                'th',
                                'td'
                            ],
                            ADD_ATTR: [
                                'allowfullscreen',
                                'frameborder',
                                'data-story',
                                'viewBox',
                                'd',
                                'stroke',
                                'stroke-width',
                                'fill',
                                'stroke-linecap',
                                'stroke-linejoin',
                                'cx',
                                'cy',
                                'r',
                                'x1',
                                'y1',
                                'x2',
                                'y2',
                                'points',
                                'title',
                                'style',
                                'class',
                                'type',
                                'value'
                            ]
                        });

                        canvasElement.innerHTML = `
                <div class="sb-custom-docs-container">
                    <div class="sb-markdown-body">${cleanHtml}</div>
                </div>
            `;

                        const style = document.createElement('style');
                        style.innerHTML = DEFENSIVE_CSS;
                        canvasElement.appendChild(style);

                        cleanupTOC = mountDocBlocksInteractivity(
                            canvasElement,
                            context
                        );
                    },
                    unmount: (canvasElement) => {
                        isMounted = false;
                        if (typeof cleanupTOC === 'function') cleanupTOC();
                        canvasElement.innerHTML = '';
                    }
                };
            },
            theme: setDocsTheme(docsTheme)
        }
    },
    globalTypes: globalTypes
};

preview.parameters.options = {
    storySort: {
        order: process.env.STORYBOOK_SORT_ORDER
            ? JSON.parse(process.env.STORYBOOK_SORT_ORDER)
            : []
    }
};

export default preview;
