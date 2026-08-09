const config = {
  stories: ['../vendor/area17/blast/stories/**/*.stories.json'],
  addons: [
    '../vendor/area17/blast/node_modules/@storybook/addon-links/dist',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/actions',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/backgrounds',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/controls',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/docs',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/highlight',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/measure',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/outline',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/toolbars',
    '../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/viewport',
    '../vendor/area17/blast/node_modules/@storybook/addon-a11y',
    '../vendor/area17/blast/node_modules/@storybook/addon-designs',
    '../vendor/area17/blast/node_modules/storybook-source-code-addon',
    '../vendor/area17/blast/node_modules/@etchteam/storybook-addon-status'
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
