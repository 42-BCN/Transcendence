import { cn } from '@/lib/styles/cn';

const overlayBase = ['absolute top-0 left-0 w-full z-[100]', 'h-[var(--page-height)]'];

const overlayRacStates = [
  'data-[entering]:bg-black/30 data-[entering]:backdrop-blur-md',
  'data-[exiting]:bg-black/0 data-[exiting]:backdrop-blur-none',
];

export function drawerOverlayStyles() {
  return cn(overlayBase, overlayRacStates);
}

const drawerBase = [
  'fixed left-0 top-0 h-screen rounded-lg',
  'bg-bg-primary/50 dark:bg-bg-primary/30',
  'backdrop-blur-md',
  'border-r border-border-primary',
  'shadow-[8px_0_20px_var(--color-shadow)]',
  'transition-transform duration-300',
  'translate-x-0',
];

const drawerRacStates = [
  'data-[enter]:translate-x-0 h-data-[entering]:translate-x-0 data-[entered]:translate-x-0',
];

export function drawerStyles() {
  return cn(drawerBase, drawerRacStates);
}
