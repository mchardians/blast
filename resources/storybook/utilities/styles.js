export const BASE_STYLES = `
    .sbdocs.sbdocs-wrapper {
        padding: 0 !important;
    }
    .sbdocs.sbdocs-content {
        max-width: 100% !important;
        width: 100% !important;
    }

    .sb-custom-docs-container {
        padding: 2rem !important;
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
        margin-top: 1.25em !important;
        margin-bottom: 1.25em !important;
        font-size: 1rem !important;
    }

    .sb-markdown-body h1, .sb-markdown-body h2, .sb-markdown-body h3 {
        color: #0f172a !important;
        font-weight: 600 !important;
    }

    .sb-markdown-body h1 {
        font-weight: 800 !important;
        font-size: 2.25em !important;
        margin-bottom: 0.888em !important;
    }

    .sb-markdown-body h2 {
        font-weight: 700 !important;
        font-size: 1.5em !important;
        margin-top: 2em !important;
        border-bottom: 1px solid #e2e8f0 !important;
        padding-bottom: 0.3em !important;
    }

    .sb-markdown-body h3 {
        font-size: 1.25em !important;
        margin-top: 1.6em !important;
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
        color: #0284c7 !important; font-weight: 700 !important;
    }

    @media (min-width: 1200px) {
        .sb-custom-toc {
            display: block;
        }

        .sb-custom-docs-container {
            padding-right: 280px !important;
        }
    }
`;

export const DOCBLOCK_STYLES = `
    .sb-canvas-container {
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        margin: 2rem 0;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
    }

    .sb-canvas-toolbar {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .sb-toolbar-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #64748b;
        padding: 0.25rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
        background 0.2s, color 0.2s;
    }

    .sb-toolbar-btn:hover {
        background: #f1f5f9;
        color: #0f172a;
    }

    .sb-canvas-preview-area {
        overflow: hidden;
        position: relative;
        padding: 1rem;
        background: #fff;
    }

    .sb-inline-canvas {
        border: none !important;
        margin: 0 !important;
        width: 100%;
        transition: transform 0.2s ease;
    }

    .sb-canvas-action-bar {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #e2e8f0;
        padding: 0.5rem 1rem;
        background: #f8fafc;
    }

    .sb-toggle-code-btn {
        background: #fff;
        border: 1px solid #cbd5e1;
        padding: 0.375rem 0.75rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.2s;
    }

    .sb-toggle-code-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
    }

    .sb-canvas-code-block {
        position: relative;
        background: #1e293b;
        color: #f8fafc;
        padding: 1rem;
        border-top: 1px solid #e2e8f0;
        font-size: 0.875rem;
        overflow-x: auto;
    }

    .sb-canvas-code-block pre {
        margin: 0 !important;
    }

    .sb-canvas-code-block code {
        background: none !important;
        color: inherit !important;
        padding: 0 !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    }

    .sb-copy-code-btn {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background: #0f172a;
        color: #fff;
        border: 1px solid #334155;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .sb-copy-code-btn:hover {
        background: #334155;
    }

    .sb-custom-controls-wrapper {
        margin: 2rem 0;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
    }

    .sb-controls-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
        background: #fff;
        margin: 0 !important;
    }

    .sb-controls-table th {
        background: #f8fafc;
        padding: 0.875rem 1rem;
        text-align: left;
        font-weight: 600;
        color: #334155;
        border-bottom: 1px solid #e2e8f0;
    }

    .sb-controls-table td {
        padding: 0.875rem 1rem;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }

    .sb-prop-name {
        color: #0f172a;
        font-weight: 600;
        background: #f1f5f9;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        border: 1px solid #e2e8f0;
    }

    .sb-control-input {
        padding: 0.375rem 0.5rem;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        font-size: 0.875rem;
        width: 100%;
        max-width: 250px;
    }
`;

export const DEFENSIVE_CSS = BASE_STYLES + TOC_STYLES + DOCBLOCK_STYLES;
