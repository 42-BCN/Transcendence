import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import ignores from '../eslint.ignore.mjs';
import noLiteralUiStrings from './only-i18n-strings.mjs';

export default [
  ignores,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/app/\\[locale\\]/(public)/ui/**', 'src/features/game/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
        tsconfigRootDir: new URL('..', import.meta.url).pathname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      local: {
        rules: {
          'no-literal-ui-strings': noLiteralUiStrings,
        },
      },
    },
    rules: {
      'local/no-literal-ui-strings': 'error',
    },
  },
];
