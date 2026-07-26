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
    '../vendor/area17/blast/node_modules/@storybook/addon-designs'
  ],
  docs: {
    autodocs: 'tag',
    defaultName: 'Docs'
  },
  framework: {
    name: '@storybook/server-webpack5',
    options: {
      quiet: true
    }
  },
  env: (config) => ({
    ...config,
    STORYBOOK_SERVER_URL: process.env.STORYBOOK_SERVER_URL || '',
    STORYBOOK_VIEWPORTS: process.env.STORYBOOK_VIEWPORTS || 'null',
    STORYBOOK_EXPANDED_CONTROLS:
      process.env.STORYBOOK_EXPANDED_CONTROLS || 'true',
    STORYBOOK_SORT_ORDER: process.env.STORYBOOK_SORT_ORDER || '[]',
    STORYBOOK_GLOBAL_TYPES: process.env.STORYBOOK_GLOBAL_TYPES || '{}',
    STORYBOOK_DOCS_THEME: process.env.STORYBOOK_DOCS_THEME || '"normal"',
    STORYBOOK_THEME: process.env.STORYBOOK_THEME || '"normal"'
  })
};

export default config;
