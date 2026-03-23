import { cn } from '@/lib/styles/cn';

export function footerStyles(className?: string) {
  return cn('relative w-full pt-3 border-t border-white/10', className);
}

export function footerContainerStyles() {
  return cn('flex flex-col items-start px-4 gap-1 w-full');
}

export function footerLinksGroupStyles() {
  return cn('flex flex-col items-start gap-1 w-full');
}

export function footerLinkItemStyles() {
  return cn(
    'inline-flex items-center whitespace-nowrap text-slate-500 hover:text-slate-800 text-[11px] transition-colors',
    // TODO: When dark support is on: 'dark:text-white/50 dark:hover:text-white'
  );
}

export function footerCopyrightStyles() {
  return cn(
    'text-slate-400 text-[10px] text-left mt-1.5 whitespace-nowrap',
    // TODO: When dark support is on: 'dark:text-white/30'
  );
}
