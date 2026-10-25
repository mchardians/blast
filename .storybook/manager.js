import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';
import theme from './theme';

const parseEnv = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        return fallback;
    }
};

const configTheme = parseEnv(process.env.STORYBOOK_THEME, 'normal');

addons.setConfig({
    enableShortcuts: true,
    sidebar: {
        showRoots: true,
        collapsedRoots: ['utilities']
    },
    toolbar: {
        zoom: {
            hidden: true
        }
    }
});

let storybookTheme = () => {
    if (configTheme === 'dark') {
        addons.setConfig({ theme: themes.dark });
    } else {
        addons.setConfig({ theme: themes.normal });
    }
};

let customTheme = () => {
    addons.setConfig({ theme });
};

if (typeof configTheme !== 'string') {
    customTheme();
} else {
    if (configTheme === 'custom') {
        customTheme();
    } else {
        storybookTheme();
    }
}
