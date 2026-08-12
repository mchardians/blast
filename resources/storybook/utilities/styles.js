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
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        background: #ffffff;
    }

    .sb-controls-table {
        width: 100%;
        border-collapse: collapse;
        font-family: ui-sans-serif, system-ui, sans-serif !important;
        font-size: 14px;
    }

    .sb-controls-table th {
        text-align: left;
        padding: 16px 20px;
        color: #64748b;
        font-weight: 600;
        font-size: 13px;
        border-bottom: 1px solid #e2e8f0;
        background: #ffffff;
    }

    .sb-controls-table td {
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
        color: #334155;
    }

    .sb-controls-table tr:last-child td { border-bottom: none; }

    .sb-prop-name {
        color: #0f172a;
        font-weight: 600;
        background: #f1f5f9;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        border: 1px solid #e2e8f0;
    }

    .sb-control-textarea {
        width: 100%;
        max-width: 280px;
        padding: 10px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        color: #1e293b;
        background-color: #ffffff;
        resize: vertical;
        min-height: 42px;
        box-sizing: border-box;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) inset;
    }

    .sb-control-textarea:focus {
        outline: none;
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }

    .sb-control-bool-toggle {
        display: inline-flex;
        background-color: #e2e8f0;
        border-radius: 20px;
        padding: 3px;
    }

    .sb-bool-btn {
        appearance: none;
        border: none;
        background: transparent;
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .sb-bool-btn.sb-active {
        background-color: #ffffff;
        color: #0f172a;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .sb-control-radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 4px;
    }

    .sb-radio-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #334155;
        cursor: pointer;
    }

    .sb-radio-label input[type="radio"] {
        margin: 0;
        width: 16px;
        height: 16px;
        accent-color: #0ea5e9;
        cursor: pointer;
    }

    .sb-control-select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 100% !important;
        max-width: 280px !important;
        padding: 10px 36px 10px 12px !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        font-family: inherit !important;
        color: #1e293b !important;
        background-color: #ffffff !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) inset !important;
        cursor: pointer !important;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
    }

    .sb-control-select::-ms-expand {
        display: none !important;
    }

    .sb-control-select:focus {
        outline: none !important;
        border-color: #38bdf8 !important;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2) !important;
    }
`;

export const DEFENSIVE_CSS = BASE_STYLES + TOC_STYLES + DOCBLOCK_STYLES;
