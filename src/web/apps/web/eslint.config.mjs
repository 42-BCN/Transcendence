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
import ignores from './eslint.ignore.mjs';
import uiArchitectureRules from './.eslint/ui-architecture.mjs';
import importRules from './.eslint/import.mjs';
import unusedImportsRules from './.eslint/unused-imports.mjs';
import unicornRules from './.eslint/unicorn.mjs';

const sharedRules = {
  rules: {
    'no-nested-ternary': 'error',
    'no-else-return': 'warn',
    'no-mixed-operators': 'warn',
    'no-implicit-coercion': 'warn',
    'max-depth': ['warn', 4],
    'prefer-template': 'warn',
    complexity: ['error', { max: 8 }],
    eqeqeq: ['error', 'always'],
    'max-lines-per-function': [
      'warn',
      {
        max: 42,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
  },
};

export default [
  ignores,
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
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

      /* ------------------------------ Styling -------------------------------- */
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="style"]',
          message: 'Inline styles are forbidden. Use className + *.styles.ts only.',
        },
      ],

      ...unusedImportsRules,
      ...importRules,
      ...uiArchitectureRules,
      ...unicornRules,
      ...sharedRules.rules,
      ...prettierConfig.rules,
      'jsx-a11y/anchor-is-valid': 'off',
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Do not use process.env.* directly. Use envPublic/envServer entrypoints.',
        },
      ],
    },
  },
  {
    files: ['./src/components/ui/controls/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 3],
      'max-lines-per-function': ['warn', { max: 30 }],
    },
  },
  {
    files: ['./src/components/features/**/*.{ts,tsx}'],
    rules: {
      complexity: ['warn', 6],
    },
  },
  {
    files: ['./src/**/*.styles.{ts,tsx}'],
    rules: {
      complexity: ['warn', 6],
    },
  },
  {
    files: ['scripts/**/*.{js,cjs,mjs,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: null,
        tsconfigRootDir: import.meta.dirname,
      },

      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...sharedRules.rules,
    },
  },
  {
    // Env variables guardrails
    files: ['src/lib/env.public.ts', 'src/lib/env.server.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
  // Allow process.env access ONLY in env modules,
  // but still ban process.env.FOO (member access) specifically
  {
    files: ['src/lib/env.public.ts', 'src/lib/env.server.ts'],
    rules: {
      'no-restricted-properties': 'off',
      'no-restricted-syntax': 'off',
    },
  },
];
