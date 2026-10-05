import { create } from 'storybook/theming';
import { resolve, type Mode } from '../src/tokens/flatten';

/** Storybook's own chrome, dressed in the system's tokens for each theme. */
function chrome(mode: Mode) {
  const t = (name: string) => resolve(name, mode);
  return create({
    base: mode,
    brandTitle: 'Design system · Tamir Said-Ahmed',
    brandUrl: 'https://www.tamirsaidahmed.com',
    brandTarget: '_blank',
    colorPrimary: t('accent-base'),
    colorSecondary: t('accent-base'),
    appBg: t('surface-base'),
    appContentBg: t('surface-base'),
    appPreviewBg: t('surface-base'),
    appBorderColor: t('border-default'),
    appBorderRadius: 12,
    fontBase: t('font-sans'),
    fontCode: t('font-mono'),
    textColor: t('text-primary'),
    textInverseColor: t('text-inverse'),
    textMutedColor: t('text-muted'),
    barTextColor: t('text-muted'),
    barHoverColor: t('accent-text'),
    barSelectedColor: t('accent-text'),
    barBg: t('surface-raised'),
    buttonBg: t('surface-raised'),
    buttonBorder: t('border-default'),
    booleanBg: t('surface-muted'),
    booleanSelectedBg: t('surface-raised'),
    inputBg: t('surface-raised'),
    inputBorder: t('border-strong'),
    inputTextColor: t('text-primary'),
    inputBorderRadius: 6,
  });
}

export const chromeThemes = { light: chrome('light'), dark: chrome('dark') };
