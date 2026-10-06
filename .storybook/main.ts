import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // Favicon, share image, llms.txt and sitemap for the public site.
  staticDirs: ['../public'],
};

export default config;
