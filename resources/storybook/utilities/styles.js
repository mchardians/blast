export const BASE_STYLES = `
    .sbdocs.sbdocs-wrapper {
        padding: 0 !important;
    }
    .sbdocs.sbdocs-content {
        max-width: 100% !important;
        width: 100% !important;
    }

    .sb-custom-docs-container {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;

        box-sizing: border-box !important;

        max-width: 1400px !important;
        margin: 0 auto !important;
        font-family: ui-sans-serif, system-ui, sans-serif !important;
        color: #334155 !important;
        line-height: 1.75 !important;
    }

    .sb-system-notice {
        margin-bottom: 2rem !important;
        padding: 1rem !important;
        background-color: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 0.5rem !important;
    }

    .sb-markdown-body p {
        margin-top: 0 !important;
        margin-bottom: 1.5rem !important;
        font-size: 1rem !important;
        color: #334155 !important;
        line-height: 1.6 !important;
    }

    .sb-markdown-body h1, .sb-markdown-body h2, .sb-markdown-body h3 {
        color: #0f172a !important;
    }

    .sb-markdown-body h1 {
        font-weight: 700 !important;
        font-size: 2.25rem !important;
        color: #1e293b !important;
        margin-top: 0 !important;
        margin-bottom: 0.5rem !important;
        line-height: 1.2 !important;
    }

    .sb-markdown-body h2 {
        font-weight: 400 !important;
        font-size: 1.5rem !important;
        color: #64748b !important;
        margin-top: 0 !important;
        margin-bottom: 1.5rem !important;
        border-bottom: none !important;
        padding-bottom: 0 !important;
        line-height: 1.4 !important;
    }

    .sb-markdown-body h3 {
        font-weight: 600 !important;
        font-size: 1.25em !important;
        margin-top: 2rem !important;
        margin-bottom: 1rem !important;
    }

    .sb-markdown-body ul {
        padding-left: 1.625em !important;
        list-style-type: disc !important;
    }

    .sb-markdown-body code {
        color: #111827 !important;
        background-color: #f1f5f9 !important;
        font-size: 0.875em !important;
        font-family: monospace !important;
        padding: 0.25rem 0.375rem !important;
        border-radius: 0.375rem !important;
    }
`;

export const TOC_STYLES = `
    .sb-custom-toc {
        position: fixed;
        top: 4rem;
        right: 2rem;
        width: 240px;
        max-height: calc(100vh - 6rem);
        overflow-y: auto;
        border-left: 2px solid #e2e8f0;
        padding-left: 1rem;
        display: none;
    }

    .sb-custom-toc .toc-title {
        font-weight: 600;
        font-size: 0.75rem;
        color: #64748b;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
    }

    .sb-custom-toc ul {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .sb-custom-toc li {
        margin-bottom: 0.5rem !important;
    }

    .sb-custom-toc li.toc-h3 {
        padding-left: 0.85rem;
    }

    .sb-custom-toc a {
        text-decoration: none !important;
        color: #64748b !important;
        font-size: 0.85rem !important;
        display: block;
        font-weight: 400!important;
        transition: all 0.2s;
    }

    .sb-custom-toc a:hover {
        color: #0284c7 !important;
    }

    .sb-custom-toc a.active-toc {
        color: #0284c7 !important;
        font-weight: 700 !important;
    }

    @media (min-width: 1200px) {
        .sb-custom-toc {
            display: block;
        }

        .sb-custom-docs-container {
            padding-right: 320px !important;
        }
    }
`;
