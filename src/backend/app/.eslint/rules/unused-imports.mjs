export default {
  // Disable both base + TS no-unused-vars to avoid duplicate/contradicting reports.
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',

  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    },
  ],
};
