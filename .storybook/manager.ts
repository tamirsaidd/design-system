import { addons } from 'storybook/manager-api';
import { chromeThemes } from './themes';

// Storybook titles every page "... ⋅ Storybook". This is a portfolio case
// study, so the tab names its author instead.
const SUFFIX = /\s*⋅ Storybook$/;
const retitle = () => {
  if (SUFFIX.test(document.title)) document.title = document.title.replace(SUFFIX, ' · Tamir Said-Ahmed');
};
retitle();
new MutationObserver(retitle).observe(document.head, { subtree: true, childList: true, characterData: true });

addons.setConfig({
  theme: chromeThemes.light,
  sidebar: { showRoots: true },
});
