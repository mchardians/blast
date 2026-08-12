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

    const updateIframes = (key, val) => {
        currentArgs[key] = val;
        const argsString = Object.entries(currentArgs)
            .map(([k, v]) => `${k}:${v}`)
            .join(';');

        const iframes = canvasElement.querySelectorAll('.sb-inline-canvas');
        iframes.forEach((iframe) => {
            const exactStoryId = iframe.getAttribute('data-story');
            iframe.src = `iframe.html?id=${exactStoryId}&viewMode=story&args=${argsString}`;
        });
    };

    const tableHTML = `
        <table class="sb-controls-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th style="width: 35%;">Description</th>
                    <th style="width: 15%;">Default</th>
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

            let typeName = 'string';
            if (schema.control && schema.control.type)
                typeName = schema.control.type;
            else if (schema.type && schema.type.name)
                typeName = schema.type.name;

            let defaultVal = schema.defaultValue;
            if (
                defaultVal === undefined &&
                schema.table?.defaultValue?.summary !== undefined
            ) {
                defaultVal = schema.table.defaultValue.summary;
            }

            const tdName = document.createElement('td');
            const isRequired = schema.type?.required
                ? '<span class="sb-prop-required">*</span>'
                : '';

            tdName.innerHTML = `<span class="sb-prop-name">${key}</span>${isRequired}`;

            const tdDesc = document.createElement('td');
            const typeHtml = typeName
                ? `<div class="sb-prop-type" style="margin-top: 8px;"><code>${typeName}</code></div>`
                : '';
            tdDesc.innerHTML = `<span class="sb-prop-desc">${schema.description || '-'}</span>${typeHtml}`;

            const tdDefault = document.createElement('td');
            const defaultHtml =
                defaultVal !== undefined && defaultVal !== ''
                    ? `<div class="sb-prop-default"><code>${defaultVal}</code></div>`
                    : '-';
            tdDefault.innerHTML = defaultHtml;

            const tdInput = document.createElement('td');
            const controlType = schema.control?.type || schema.control;

            if (schema.options && Array.isArray(schema.options)) {
                const selectEl = document.createElement('select');
                selectEl.className = 'sb-control-select';

                schema.options.forEach((opt) => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    if (defaultVal === opt) option.selected = true;
                    selectEl.appendChild(option);
                });

                selectEl.addEventListener('change', (e) =>
                    updateIframes(key, e.target.value)
                );
                tdInput.appendChild(selectEl);
            } else if (controlType === 'boolean') {
                const boolWrapper = document.createElement('div');
                boolWrapper.className = 'sb-control-bool-toggle';

                const isDefaultTrue =
                    defaultVal === true || defaultVal === 'true';

                const btnFalse = document.createElement('button');
                btnFalse.className = `sb-bool-btn ${!isDefaultTrue ? 'sb-active' : ''}`;
                btnFalse.textContent = 'False';

                const btnTrue = document.createElement('button');
                btnTrue.className = `sb-bool-btn ${isDefaultTrue ? 'sb-active' : ''}`;
                btnTrue.textContent = 'True';

                btnFalse.addEventListener('click', () => {
                    btnFalse.classList.add('sb-active');
                    btnTrue.classList.remove('sb-active');
                    updateIframes(key, false);
                });

                btnTrue.addEventListener('click', () => {
                    btnTrue.classList.add('sb-active');
                    btnFalse.classList.remove('sb-active');
                    updateIframes(key, true);
                });

                boolWrapper.appendChild(btnFalse);
                boolWrapper.appendChild(btnTrue);
                tdInput.appendChild(boolWrapper);
            } else {
                const textarea = document.createElement('textarea');
                textarea.className = 'sb-control-textarea';
                textarea.rows = 1;

                if (defaultVal !== undefined) {
                    textarea.value = defaultVal;
                }

                textarea.addEventListener('input', (e) =>
                    updateIframes(key, e.target.value)
                );
                tdInput.appendChild(textarea);
            }

            tr.appendChild(tdName);
            tr.appendChild(tdDesc);
            tr.appendChild(tdDefault);
            tr.appendChild(tdInput);
            tbody.appendChild(tr);
        });
    });
};
