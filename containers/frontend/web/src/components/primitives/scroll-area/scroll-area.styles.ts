import { cn } from '@/lib/styles/cn';

const base = `
  flex-1
  min-h-0
  min-w-0
  overflow-y-scroll
  overflow-x-hidden
  overscroll-contain
  touch-pan-y
`;

export function scrollAreaStyles(className?: string) {
  return cn(base, className);
}
