export const parseTypography = (htmlString, context) => {
    let html = htmlString;

    html = html.replace(/\[render-title\]/gi, () => {
        return `<h1 class="sb-docs-title">${context.title || 'Component'}</h1>`;
    });

    html = html.replace(/\[render-subtitle\]/gi, () => {
        return `<h3 class="sb-docs-subtitle" style="color: #64748b; font-weight: 400; margin-top: 0;">${context.title || ''} UI Component</h3>`;
    });

    html = html.replace(/\[render-description\]/gi, () => {
        if (!context.description) return '';
        return `<p class="sb-docs-description" style="font-size: 1.125rem; color: #334155;">${context.description}</p>`;
    });

    return html;
};
