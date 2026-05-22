import { cn } from '@/lib/styles/cn';

export const messagesLayoutStyles = {
  root: 'pointer-events-auto relative flex h-[100dvh] w-full min-w-0 flex-1 overflow-hidden',
  // Use fixed positioning on mobile with a very high z-index so the toggle escapes
  // other stacking contexts (drawer overlays, portals). Keep desktop as absolute.
  toggleButton:
    'fixed right-4 top-16 z-[9999] pointer-events-auto md:hidden md:top-4 md:absolute md:right-4 md:z-[200]',
  overlay:
    'absolute inset-0 z-10 flex pointer-events-none md:static md:z-auto md:flex-none md:pointer-events-auto',
  backdrop: (isVisible: boolean) =>
    cn(
      'absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity md:hidden',
      isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
    ),
  panel: (isVisible: boolean) =>
    cn(
      'relative flex h-full min-h-0 w-[min(24rem,calc(100vw-2rem))] max-w-full shrink-0 overflow-hidden transition-transform duration-300 md:ml-8 md:w-[400px] md:max-w-none md:translate-x-0',
      isVisible ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none',
      'md:pointer-events-auto',
    ),
  panelInner:
    'flex min-h-0 w-full overflow-hidden rounded-e-2xl border-r border-border-primary bg-bg-primary/95 shadow-xl backdrop-blur-md md:rounded-none md:border-none md:bg-transparent md:shadow-none md:backdrop-blur-none',
  content: 'flex min-h-0 min-w-0 flex-1 overflow-hidden',
};
