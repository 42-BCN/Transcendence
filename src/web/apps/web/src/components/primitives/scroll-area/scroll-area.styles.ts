import { cn } from '@/lib/styles/cn';

const base = `
  h-full
  overflow-y-auto
  overflow-x-hidden
  overscroll-contain
`;

export function scrollAreaStyles() {
  return cn(base);
}
