import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import js from '@eslint/js';
import globals from 'globals';
import ignores from './.eslint/ignores.mjs';
import uiArchitectureRules from './.eslint/rules/ui-architecture.mjs';
import importRules from './.eslint/rules/import.mjs';
import unusedImportsRules from './.eslint/rules/unused-imports.mjs';
import unicornRules from './.eslint/rules/unicorn.mjs';

export default [
  ignores,
  js.configs.recommended,
  {
    files: [
      'app/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}',
      'scripts/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      unicorn,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.eslint.json'],
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      /* ----------------------------- Async safety ----------------------------- */
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            // keeps it practical in UI code (events/handlers)
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'warn',
      /* ------------------------------ TypeScript ------------------------------ */
      // Use type-only imports/exports
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'warn',

      // Safety knobs (tune severity to taste)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      /* ----------------------- Complexity & readability ------------------------ */
      'no-nested-ternary': 'error',
      'no-else-return': 'warn',
      'no-mixed-operators': 'warn',
      eqeqeq: ['error', 'always'],
      'no-implicit-coercion': 'warn',
      'max-depth': ['warn', 4],
      complexity: ['error', 5],

      // You already wanted: max-lines-per-function @42
      'max-lines-per-function': [
        'warn',
        {
          max: 42,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      /* ------------------------------ Styling -------------------------------- */
      // Ban inline styles everywhere
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="style"]',
          message: 'Inline styles are forbidden. Use className + *.styles.ts only.',
        },
      ],
      'prefer-template': 'error',

      ...unusedImportsRules,
      ...importRules,
      ...uiArchitectureRules, // review isnt working
      ...unicornRules,
      ...prettierConfig.rules,

      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
  {
    files: ['components/ui/controls/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 3],
      'max-lines-per-function': ['warn', { max: 30 }],
    },
  },
  {
    files: ['components/features/**/*.{ts,tsx}'],
    rules: {
      complexity: ['warn', 6],
    },
  },
  {
    files: ['**/*.styles.{ts,tsx}'],
    rules: {
      complexity: ['warn', 6],
    },
  },
];
