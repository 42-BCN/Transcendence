import { cn } from '@/lib/styles/cn';

export const messagesLayoutStyles = {
  root: 'pointer-events-auto relative flex h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden',
  toggleButton: 'absolute right-4 top-16 z-20 pointer-events-auto lg:hidden lg:top-4',
  overlay:
    'absolute inset-0 z-10 flex pointer-events-none lg:static lg:z-auto lg:flex-none lg:pointer-events-auto',
  backdrop: (isVisible: boolean) =>
    cn(
      'absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden',
      isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
    ),
  panel: (isVisible: boolean) =>
    cn(
      'relative flex h-full min-h-0 w-[min(24rem,calc(100vw-2rem))] max-w-full shrink-0 overflow-hidden transition-transform duration-300 lg:ml-8 lg:w-[400px] lg:max-w-none lg:translate-x-0',
      isVisible ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none',
      'lg:pointer-events-auto',
    ),
  panelInner:
    'flex min-h-0 w-full overflow-hidden rounded-e-2xl border-r border-border-primary bg-bg-primary/95 shadow-xl backdrop-blur-md glass-fallback lg:rounded-none lg:border-none lg:bg-transparent lg:shadow-none lg:backdrop-blur-none',
  content: 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden touch-pan-y',
};
