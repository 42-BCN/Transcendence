export const chatStyles = {
  wrapper:
    'h-full min-h-0 min-w-0 flex-1 backdrop-blur-sm rounded-xl overflow-hidden border-l border-gray-200/20 pointer-events-auto',

  header: {
    wrapper:
      'px-5 py-3 relative z-30 bg-bg-primary shadow-[0_4px_6px_-1px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity)),0_2px_4px_-2px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))]',
  },
  main: {
    wrapper: 'px-3 py-4',
    metaRow: 'flex justify-center',
    metaText: 'whitespace-pre-wrap text-center opacity-75',
  },
  footer: {
    wrapper:
      'md:w-full relative z-30 bg-bg-primary shadow-[0_-4px_6px_-1px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity)),0_-2px_4px_-2px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))]',
    input: 'rounded-none px-3 border-none md:max-w-full',
  },
};
