export const formatSourceCode = (rawCode, args) => {
    if (!rawCode) return '';

    let code = rawCode;

    code = code.replace(
        /\{(?:\{|!!)\s*\$([a-zA-Z0-9_]+)(?:\s*\?\?\s*(?:'([^']*)'|"([^"]*)"))?\s*(?:\}|!!)\}/g,
        (match, key, singleQuoted, doubleQuoted) => {
            if (args[key] !== undefined) return args[key];

            const fallback = singleQuoted ?? doubleQuoted;

            return fallback !== undefined ? fallback : match;
        }
    );

    code = code.replace(
        /\s*:([a-zA-Z0-9_-]+)="\$([a-zA-Z0-9_]+)"/g,
        (match, attr, key) => {
            const val = args[key];

            if (
                val === false ||
                val === '' ||
                val === null ||
                val === undefined
            ) {
                return '';
            }

            if (val === true) {
                return ` ${attr}`;
            }

            return ` ${attr}="${val}"`;
        }
    );

    return code.replace(/\n\s*\n/g, '\n');
};
