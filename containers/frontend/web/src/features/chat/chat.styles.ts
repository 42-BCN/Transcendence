export const chatStyles = {
  wrapper:
    'h-full bg-bg-primary/50 dark:bg-bg-primary/30 backdrop-blur-sm rounded-xl overflow-hidden border-l border-border-primary',

  header: {
    wrapper:
      'px-5 py-3 relative z-10 bg-bg-primary shadow-[0_4px_6px_-1px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity)),0_2px_4px_-2px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))]',
  },
  main: {
    wrapper: 'px-3 py-4',
  },
  footer: {
    wrapper:
      'relative z-10 bg-bg-primary shadow-[0_-4px_6px_-1px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity)),0_-2px_4px_-2px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))]',
    input: 'rounded-none px-3 border-none',
  },
};
