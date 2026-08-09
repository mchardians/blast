import '../public/main.css';
import { themes } from '@storybook/theming';
import theme from './theme';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
    console.log(`[Storybook Debug] ${key}:`, parsed);
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

const DEFENSIVE_CSS = `
    .sb-custom-docs-container { padding: 2rem !important; max-width: 56rem !important; margin: 0 auto !important; font-family: ui-sans-serif, system-ui, sans-serif !important; color: #334155 !important; line-height: 1.75 !important; }
    .sb-system-notice { margin-bottom: 2rem !important; padding: 1rem !important; background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-radius: 0.5rem !important; }
    .sb-markdown-body p { margin-top: 1.25em !important; margin-bottom: 1.25em !important; font-size: 1rem !important; }
    .sb-markdown-body h1 { color: #0f172a !important; font-weight: 800 !important; font-size: 2.25em !important; margin-top: 0 !important; margin-bottom: 0.888em !important; line-height: 1.111 !important; }
    .sb-markdown-body h2 { color: #0f172a !important; font-weight: 700 !important; font-size: 1.5em !important; margin-top: 2em !important; margin-bottom: 1em !important; line-height: 1.333 !important; border-bottom: 1px solid #e2e8f0 !important; padding-bottom: 0.3em !important; }
    .sb-markdown-body h3 { color: #0f172a !important; font-weight: 600 !important; font-size: 1.25em !important; margin-top: 1.6em !important; margin-bottom: 0.6em !important; line-height: 1.6 !important; }
    .sb-markdown-body ul { margin-top: 1.25em !important; margin-bottom: 1.25em !important; padding-left: 1.625em !important; list-style-type: disc !important; }
    .sb-markdown-body li { margin-top: 0.5em !important; margin-bottom: 0.5em !important; }
    .sb-markdown-body code { color: #111827 !important; background-color: #f1f5f9 !important; font-weight: 600 !important; font-size: 0.875em !important; font-family: monospace !important; padding: 0.25rem 0.375rem !important; border-radius: 0.375rem !important; }

    .sb-custom-toc { position: fixed; top: 4rem; right: 2rem; width: 240px; max-height: calc(100vh - 6rem); overflow-y: auto; border-left: 2px solid #e2e8f0; padding-left: 1rem; display: none; }
    .sb-custom-toc .toc-title { font-weight: 600; font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem; text-transform: uppercase; }
    .sb-custom-toc ul { list-style: none !important; padding: 0 !important; margin: 0 !important; }
    .sb-custom-toc li { margin-bottom: 0.5rem !important; margin-top: 0 !important; }
    .sb-custom-toc li.toc-h3 { padding-left: 0.85rem; }
    .sb-custom-toc a { text-decoration: none !important; color: #64748b !important; font-size: 0.85rem !important; display: block; font-weight: 400 !important; transition: all 0.2s; }
    .sb-custom-toc a:hover { color: #0284c7 !important; }

    /* CLASS UNTUK ACTIVE STATE (SCROLL SPY) */
    .sb-custom-toc a.active-toc { color: #0284c7 !important; font-weight: 700 !important; }

    @media (min-width: 1200px) { .sb-custom-toc { display: block; } .sb-custom-docs-container { padding-right: 280px !important; } }
`;

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
          render: async (docsContext, docsParameter, canvasElement) => {
            const rawMarkdown =
              docsParameter?.description?.component ||
              'Documentation not found.';
            const dirtyHtml = await marked.parse(rawMarkdown);

            if (!isMounted) return;
            const cleanHtml = DOMPurify.sanitize(dirtyHtml);

            canvasElement.innerHTML = `
                            <div class="sb-custom-docs-container">
                                <div class="sb-markdown-body">${cleanHtml}</div>
                            </div>
                        `;

            const style = document.createElement('style');
            style.innerHTML = DEFENSIVE_CSS;
            canvasElement.appendChild(style);

            const markdownBody =
              canvasElement.querySelector('.sb-markdown-body');
            const headings = markdownBody.querySelectorAll('h2, h3');

            if (headings.length > 0) {
              const tocContainer = document.createElement('div');
              tocContainer.className = 'sb-custom-toc';
              tocContainer.innerHTML =
                '<div class="toc-title">On this page</div><ul class="toc-list"></ul>';
              const tocList = tocContainer.querySelector('.toc-list');

              tocObserver = new IntersectionObserver(
                (entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      tocList
                        .querySelectorAll('a')
                        .forEach((a) => a.classList.remove('active-toc'));

                      const activeLink = tocList.querySelector(
                        `a[href="#${entry.target.id}"]`
                      );
                      if (activeLink) activeLink.classList.add('active-toc');
                    }
                  });
                },
                {
                  rootMargin: '-15% 0px -80% 0px'
                }
              );

              headings.forEach((heading) => {
                if (!heading.id) {
                  heading.id = heading.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                }

                const li = document.createElement('li');
                li.className = `toc-${heading.tagName.toLowerCase()}`;

                const a = document.createElement('a');
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent;
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  heading.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                });

                li.appendChild(a);
                tocList.appendChild(li);

                tocObserver.observe(heading);
              });

              canvasElement.appendChild(tocContainer);
            }
          },
          unmount: (canvasElement) => {
            isMounted = false;

            if (tocObserver) {
              tocObserver.disconnect();
              tocObserver = null;
            }

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
