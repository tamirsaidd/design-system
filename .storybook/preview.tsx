import '@fontsource-variable/geist-mono';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/outfit';
import '../src/styles/index.css';
import './docs.css';

import type { Decorator, Preview } from '@storybook/react-vite';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import { DocsContainer } from './DocsContainer';

type Globals = { theme?: string } | undefined;

/** The whole preview, docs pages included, follows the toolbar theme. */
function applyTheme(theme: unknown) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}

const channel = addons.getChannel();
channel.on(SET_GLOBALS, ({ globals }: { globals: Globals }) => applyTheme(globals?.theme));
channel.on(GLOBALS_UPDATED, ({ globals }: { globals: Globals }) => applyTheme(globals?.theme));

const withTheme: Decorator = (Story, context) => {
  applyTheme(context.globals.theme);
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    backgrounds: { disable: true },
    a11y: { test: 'error' },
    docs: { container: DocsContainer, codePanel: true },
    options: {
      storySort: {
        order: [
          'Docs',
          ['Design principles', 'Tokens', 'Accessibility', 'Usage'],
          'Components',
          'Chapters',
          ['Education platform', ['Intro', 'Program browse', 'Eligibility result', 'Scholarship list', 'Before and after']],
        ],
      },
    },
  },
};

export default preview;
