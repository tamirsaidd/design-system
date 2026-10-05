import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['storybook-static', 'node_modules', 'dist', '!.storybook']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: [reactHooks.configs.flat.recommended],
    rules: {
      // Pulling props out of a rest spread to drop them is intentional.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.{ts,mjs}', '*.config.{js,ts}', '.storybook/main.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    // These drive a browser: code inside page.evaluate runs in the page.
    files: ['scripts/a11y-check.mjs', 'scripts/screenshots.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  storybook.configs['flat/recommended'],
]);
