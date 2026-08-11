const config = {
    stories: ['../vendor/area17/blast/stories/**/*.stories.json'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-controls',
        '@storybook/addon-a11y',
        '@storybook/addon-designs',
        'storybook-source-code-addon',
        '@etchteam/storybook-addon-status'
    ],
    docs: {
        autodocs: 'tag',
        defaultName: 'Docs'
    },
    features: {
        storyStoreV7: true
    },
    framework: {
        name: '@storybook/server-webpack5',
        options: {
            quiet: true
        }
    },
    webpackFinal: async (config) => {
        config.devtool = false;
        return config;
    }
};

export default config;
