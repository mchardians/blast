export const initTOC = (canvasElement) => {
    const markdownBody = canvasElement.querySelector('.sb-markdown-body');
    const container = canvasElement.querySelector('.sb-custom-docs-container');

    if (!markdownBody || !container) return null;

    const headings = markdownBody.querySelectorAll('h2, h3');
    if (headings.length === 0) return null;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'sb-custom-toc';
    tocContainer.innerHTML =
        '<div class="toc-title">On this page</div><ul class="toc-list"></ul>';

    const tocList = tocContainer.querySelector('.toc-list');
    let tocObserver = null;

    headings.forEach((heading, index) => {
        if (!heading.id) {
            const text = heading.innerText || heading.textContent;
            heading.id =
                text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') +
                '-' +
                index;
        }

        const li = document.createElement('li');
        li.className =
            heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2';

        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.innerText = heading.innerText || heading.textContent;

        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });

            tocList
                .querySelectorAll('a')
                .forEach((link) => link.classList.remove('active-toc'));
            a.classList.add('active-toc');

            if (window.history && window.history.pushState) {
                window.history.pushState(null, null, '#' + heading.id);
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    container.appendChild(tocContainer);

    tocObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocList.querySelectorAll('a').forEach((link) => {
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active-toc');
                        } else {
                            link.classList.remove('active-toc');
                        }
                    });
                }
            });
        },
        {
            rootMargin: '0px 0px -80% 0px'
        }
    );

    headings.forEach((h) => tocObserver.observe(h));

    return () => {
        if (tocObserver) {
            tocObserver.disconnect();
        }
        if (tocContainer && tocContainer.parentNode) {
            tocContainer.parentNode.removeChild(tocContainer);
        }
    };
};
