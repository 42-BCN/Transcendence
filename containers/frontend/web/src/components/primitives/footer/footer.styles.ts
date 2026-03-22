import { cn } from '@/lib/styles/cn';

export function footerStyles(className?: string) {
  return cn(
    'relative w-full border-t border-white/[0.06] bg-slate-950/30 backdrop-blur-sm py-5 mt-auto',
    className,
  );
}

export function footerContainerStyles() {
  return cn('mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4');
}

export function footerLinksGroupStyles() {
  return cn('flex items-center gap-6');
}

export function footerLinkItemStyles() {
  return cn('text-white/60 hover:text-white text-sm transition-colors');
}

export function footerCopyrightStyles() {
  return cn('text-white/40 text-sm');
}
