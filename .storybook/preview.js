import '../vendor/area17/blast/public/main.css';
import { themes } from '@storybook/theming';
import theme from './theme';

let setDocsTheme = (configDocsTheme) => {
  if (configDocsTheme === 'dark') {
    return themes.dark;
  } else if (configDocsTheme === 'custom') {
    return theme;
  } else {
    return themes.normal;
  }
};

const parsedViewports = process.env.STORYBOOK_VIEWPORTS
  ? JSON.parse(process.env.STORYBOOK_VIEWPORTS)
  : null;
const parsedExpandedControls = process.env.STORYBOOK_EXPANDED_CONTROLS
  ? JSON.parse(process.env.STORYBOOK_EXPANDED_CONTROLS)
  : true;
const parsedDocsTheme = process.env.STORYBOOK_DOCS_THEME
  ? JSON.parse(process.env.STORYBOOK_DOCS_THEME)
  : 'normal';
const parsedSortOrder = process.env.STORYBOOK_SORT_ORDER
  ? JSON.parse(process.env.STORYBOOK_SORT_ORDER)
  : [];
const parsedGlobalTypes = process.env.STORYBOOK_GLOBAL_TYPES
  ? JSON.parse(process.env.STORYBOOK_GLOBAL_TYPES)
  : {};

const resolvedTheme = setDocsTheme(parsedDocsTheme);

const preview = {
  parameters: {
    viewport: {
      viewports: parsedViewports
    },
    controls: {
      expanded: parsedExpandedControls
    },
    server: {
      url: process.env.STORYBOOK_SERVER_URL
    },
    layout: 'centered',
    docs: {
      extractComponentDescription: (component, { notes }) => {
        if (notes) {
          return typeof notes === 'string'
            ? notes
            : notes.markdown || notes.text;
        }
        return null;
      },
      theme: resolvedTheme
    },
    options: {}
  },
  globalTypes: parsedGlobalTypes
};

preview.parameters.options.storySort = {
  order: parsedSortOrder
};

export default preview;
