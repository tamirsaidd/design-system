import { addons } from 'storybook/manager-api';
import { chromeThemes } from './themes';

addons.setConfig({
  theme: chromeThemes.light,
  sidebar: { showRoots: true },
});
