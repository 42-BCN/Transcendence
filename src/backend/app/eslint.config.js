// import js from "@eslint/js";
// import tseslint from "typescript-eslint";
// import prettier from "eslint-config-prettier";

// export default tseslint.config(
//   js.configs.recommended,
//   ...tseslint.configs.recommendedTypeChecked,
//   prettier,
//   {
//     languageOptions: {
//       parserOptions: {
//         project: true,
//         tsconfigRootDir: import.meta.dirname,
//       },
//     },
//     files: ["**/*.{ts,tsx}"],
//     rules: {
//       "@typescript-eslint/no-unused-vars": [
//         "warn",
//         { argsIgnorePattern: "^_" },
//       ],
//     },
//   },
// );

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-config-prettier";
import nodePlugin from "eslint-plugin-n";
import promisePlugin from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";
import js from "@eslint/js";
import globals from "globals";

import ignores from "./.eslint/ignore.mjs";
import importRules from "./.eslint/rules/import.mjs";
import unusedImportsRules from "./.eslint/rules/unused-imports.mjs";
import unicornRules from "./.eslint/rules/unicorn.mjs";

export default [
  ignores,
  js.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      unicorn,
      n: nodePlugin,
      promise: promisePlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.eslint.json"],
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      /* ----------------------------- Async safety ----------------------------- */
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            // keeps it practical in UI code (events/handlers)
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "warn",
      /* ------------------------------ TypeScript ------------------------------ */
      // Use type-only imports/exports
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": "warn",

      // Safety knobs (tune severity to taste)
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      /* ----------------------- Complexity & readability ------------------------ */
      "no-nested-ternary": "error",
      "no-else-return": "warn",
      "no-mixed-operators": "warn",
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "warn",
      "max-depth": ["warn", 4],
      complexity: ["error", 5],

      // You already wanted: max-lines-per-function @42
      "max-lines-per-function": [
        "warn",
        {
          max: 42,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      /* ------------------------------ Styling -------------------------------- */

      "prefer-template": "error",

      ...unusedImportsRules,
      ...importRules,
      ...unicornRules,
      ...prettierConfig.rules,

      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
        },
      ],
      "import/no-cycle": "warn",

      "n/no-process-exit": "error",
      "n/no-missing-import": "off",

      "promise/always-return": "off",
      "promise/catch-or-return": "warn",

      "no-console": "off",
    },
  },
];
