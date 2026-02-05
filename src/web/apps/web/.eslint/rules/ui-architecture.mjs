export default {
  /**
   * Enforce one-way UI layering (filesystem-aware)
   *
   * ui/primitives  ❌ cannot import from controls / composites / features
   * ui/controls    ❌ cannot import from composites / features
   * ui/composites  ❌ cannot import from features
   */
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: ['./components/ui/primitives'],
          from: ['./components/ui/controls', './components/ui/composites', './components/features'],
          message: 'ui/primitives cannot import from ui/controls, ui/composites, or features.',
        },
        {
          target: ['./components/ui/controls'],
          from: ['./components/ui/composites', '/app/components/features'],
          message: 'ui/controls cannot import from ui/composites or features.',
        },
        {
          target: ['./components/ui/composites'],
          from: ['./components/features'],
          message: 'ui/composites cannot import from features.',
        },
      ],
    },
  ],

  /**
   * Alias-proof enforcement (prevents "@/..." from bypassing boundaries)
   */
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        // primitives → forbid upward imports
        {
          group: [
            '@/components/ui/controls/**',
            '@/components/ui/composites/**',
            '@/components/features/**',
          ],
          message: 'ui/primitives cannot import from ui/controls, ui/composites, or features.',
        },
        // controls → forbid composites/features
        {
          group: ['@/components/ui/composites/**', '@/components/features/**'],
          message: 'ui/controls cannot import from ui/composites or features.',
        },
        // composites → forbid features
        {
          group: ['@/components/features/**'],
          message: 'ui/composites cannot import from features.',
        },
      ],
    },
  ],
};
