const config = {
  stories: ['../stories/**/*.stories.json'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-designs'
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
  }
};

export default config;
