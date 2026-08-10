export const parseControls = (htmlString) => {
    return htmlString.replace(/\[render-(controls|argtypes)\]/gi, () => {
        return `<div class="sb-custom-controls-wrapper"></div>`;
    });
};

export const initControlsInteractivity = (canvasElement, argTypes) => {
    if (!argTypes || Object.keys(argTypes).length === 0) return;
    const wrappers = canvasElement.querySelectorAll(
        '.sb-custom-controls-wrapper'
    );

    if (wrappers.length === 0) return;

    const currentArgs = {};
    const tableHTML = `
        <table class="sb-controls-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Name</th>
                    <th style="width: 45%;">Description</th>
                    <th style="width: 30%;">Control</th>
                </tr>
            </thead>
            <tbody class="sb-controls-tbody"></tbody>
        </table>
    `;

    wrappers.forEach((wrapper) => {
        wrapper.innerHTML = tableHTML;
        const tbody = wrapper.querySelector('.sb-controls-tbody');

        Object.entries(argTypes).forEach(([key, schema]) => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.innerHTML = `<code class="sb-prop-name">${key}</code>`;

            const tdDesc = document.createElement('td');
            tdDesc.innerHTML = `<div class="sb-prop-desc">${schema.description || '-'}</div>`;

            const tdInput = document.createElement('td');
            let inputEl = null;
            const controlType = schema.control?.type || schema.control;

            if (schema.options && Array.isArray(schema.options)) {
                inputEl = document.createElement('select');
                inputEl.className = 'sb-control-input';
                schema.options.forEach((opt) => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    inputEl.appendChild(option);
                });
            } else if (controlType === 'boolean') {
                inputEl = document.createElement('input');
                inputEl.type = 'checkbox';
                inputEl.className = 'sb-control-checkbox';
            } else {
                inputEl = document.createElement('input');
                inputEl.type = 'text';
                inputEl.className = 'sb-control-input';
            }

            inputEl.addEventListener('change', (e) => {
                const val =
                    e.target.type === 'checkbox'
                        ? e.target.checked
                        : e.target.value;

                currentArgs[key] = val;

                const argsString = Object.entries(currentArgs)
                    .map(([k, v]) => `${k}:${v}`)
                    .join(';');

                const iframes =
                    canvasElement.querySelectorAll('.sb-inline-canvas');

                iframes.forEach((iframe) => {
                    const exactStoryId = iframe.getAttribute('data-story');
                    iframe.src = `iframe.html?id=${exactStoryId}&viewMode=story&args=${argsString}`;
                });
            });

            tdInput.appendChild(inputEl);
            tr.appendChild(tdName);
            tr.appendChild(tdDesc);
            tr.appendChild(tdInput);
            tbody.appendChild(tr);
        });
    });
};
