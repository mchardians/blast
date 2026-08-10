export const initTOC = (canvasElement, isMounted) => {
    const markdownBody = canvasElement.querySelector('.sb-markdown-body');
    const headings = markdownBody.querySelectorAll('h2, h3');

    let tocObserver = null;

    if (headings.length === 0 || !isMounted) return null;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'sb-custom-toc';
    tocContainer.innerHTML =
        '<div class="toc-title">On this page</div><ul class="toc-list"></ul>';

    const tocList = tocContainer.querySelector('.toc-list');
};
