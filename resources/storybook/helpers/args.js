export const parseArgsString = (argsString) => {
    const args = {};

    if (!argsString) return args;

    argsString.split(';').forEach((pair) => {
        const separatorIndex = pair.indexOf(':');

        if (separatorIndex < 1) return;

        const key = pair.slice(0, separatorIndex).trim();
        let value = pair.slice(separatorIndex + 1);

        try {
            value = decodeURIComponent(value.replace(/\+/g, ' '));
        } catch (e) {
            //
        }

        if (value === 'true') value = true;
        if (value === 'false') value = false;

        args[key] = value;
    });

    return args;
};

export const serializeArgs = (args) =>
    Object.entries(args)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
