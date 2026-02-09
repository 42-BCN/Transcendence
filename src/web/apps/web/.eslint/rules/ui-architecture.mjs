/**
 * Enforce one-way UI layering
 *
 * ✅ app/** can import features/** and ui/**
 * ✅ features/** can import ui/**
 *
 * ❌ ui/controls    cannot import ui/composites or features
 * ❌ ui/composites  cannot import features
 * ❌ ui/**          cannot import app/**
 *
 * IMPORTANT:
 * - Keep alias-string restrictions minimal here.
 * - Use filesystem-aware zones for the real layering enforcement.
 * - If you want alias rules to apply only to certain folders, do it via `files:` blocks in eslint.config.mjs.
 */
export default {
  /* -------------------------------------------------------------------------- */
  /*                          Filesystem-aware boundaries                         */
  /* -------------------------------------------------------------------------- */
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        // controls must not depend on composites
        {
          target: './components/ui/controls',
          from: './components/ui/composites',
          message:
            'ui/controls must not import from ui/composites. Move shared code down or refactor.',
        },

        // controls must not depend on features
        {
          target: './components/ui/controls',
          from: './components/features',
          message: 'ui/controls must not import from features. UI controls must stay generic.',
        },

        // composites must not depend on features
        {
          target: './components/ui/composites',
          from: './components/features',
          message: 'ui/composites must not import from features. Keep composites reusable.',
        },

        // UI must not import from app routes
        {
          target: './components/ui',
          from: './app',
          message: 'UI must not import from app/. app can import UI, not the other way around.',
        },
      ],
    },
  ],

  /* -------------------------------------------------------------------------- */
  /*                     Alias-based restrictions (safe ones)                    */
  /* -------------------------------------------------------------------------- */
  // We intentionally DO NOT restrict "@/components/features/**" here, because:
  // - app/** must be allowed to import features/**
  // - features/** must be allowed to import ui/**
  //
  // If you want "controls must not import composites" (by alias) enforce it in eslint.config.mjs with:
  // files: ['components/ui/controls/**/*.{ts,tsx}']
  // and a no-restricted-imports pattern for @ui/composites/**
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        // UI should never import from app via alias (string-based)
        {
          group: ['@/app/**'],
          message: 'UI must not import from app/. app composes UI, not the other way around.',
        },
      ],
    },
  ],
};
