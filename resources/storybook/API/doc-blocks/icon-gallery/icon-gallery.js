export const parseIconGallery = (htmlString) => {
    return htmlString.replace(
        /\[render-icongallery:(.*?)\]/gi,
        (match, url) => {
            const fetchUrl = url.trim();

            return `
                <div class="sb-icon-gallery-wrapper" data-json-url="${fetchUrl}" style="margin: 2rem 0;">
                    <div class="sb-icon-gallery-loader" style="padding: 3rem; text-align: center; color: #64748b; background: #f8fafc; border-radius: 0.5rem; border: 1px dashed #cbd5e1;">
                        <span class="sb-loader-text">Loading icon library...</span>
                    </div>
                    <div class="sb-icon-gallery-grid" style="display: none; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
                    </div>
                </div>
            `;
        }
    );
};

export const initIconGalleryInteractivity = (canvasElement) => {
    const galleries = canvasElement.querySelectorAll(
        '.sb-icon-gallery-wrapper'
    );

    galleries.forEach(async (wrapper) => {
        const url = wrapper.getAttribute('data-json-url');
        const loader = wrapper.querySelector('.sb-icon-gallery-loader');
        const loaderText = wrapper.querySelector('.sb-loader-text');
        const grid = wrapper.querySelector('.sb-icon-gallery-grid');

        if (!url) return;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch icon manifest.');

            const icons = await response.json();

            loader.style.display = 'none';
            grid.style.display = 'grid';

            icons.forEach((iconData) => {
                const iconName = iconData.name || iconData.class;
                const iconClass = iconData.class;

                const item = document.createElement('div');
                item.style.cssText =
                    'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #ffffff; cursor: pointer; transition: all 0.2s ease;';

                item.addEventListener(
                    'mouseenter',
                    () => (item.style.borderColor = '#94a3b8')
                );
                item.addEventListener(
                    'mouseleave',
                    () => (item.style.borderColor = '#e2e8f0')
                );

                item.addEventListener('click', async () => {
                    const htmlSnippet = `<i class="${iconClass}"></i>`;
                    await navigator.clipboard.writeText(htmlSnippet);

                    const nameEl = item.querySelector('.sb-icon-name');
                    const originalName = nameEl.textContent;

                    nameEl.textContent = 'Copied!';
                    nameEl.style.color = '#10b981';
                    item.style.borderColor = '#10b981';

                    setTimeout(() => {
                        nameEl.textContent = originalName;
                        nameEl.style.color = '#64748b';
                        item.style.borderColor = '#e2e8f0';
                    }, 1500);
                });

                item.innerHTML = `
                    <div class="sb-icon-preview" style="font-size: 2rem; margin-bottom: 0.75rem; color: #334155;">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="sb-icon-name" style="font-size: 0.75rem; color: #64748b; text-align: center; word-break: break-all;">
                        ${iconName}
                    </div>
                `;

                grid.appendChild(item);
            });
        } catch (error) {
            loaderText.textContent = `Error: ${error.message}`;
            loader.style.borderColor = '#f87171';
            loader.style.color = '#ef4444';
        }
    });
};
