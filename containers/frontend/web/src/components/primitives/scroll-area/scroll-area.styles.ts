import { cn } from '@/lib/styles/cn';

const base = `
  flex-1
  min-h-0
  min-w-0
  overflow-y-auto
  overflow-x-hidden
  overscroll-contain
`;

export function scrollAreaStyles(className?: string) {
  return cn(base, className);
}
