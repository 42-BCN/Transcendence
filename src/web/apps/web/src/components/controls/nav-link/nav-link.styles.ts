import { cn } from '@/lib/styles/cn';

const navBase = [
  'min-h-6, min-w-6',
  'font-caption',
  // layout
  'inline-flex items-center justify-center rounded-md min-h-6 min-w-6 gap-3',
  // behavior
  'transition outline-none',
  // default visual - will be overridden
  'opacity-80',
];

const linkRacDataAttrs = [
  'data-[current]:font-semibold data-[current]:opacity-100',
  'data-[hovered]:opacity-100',
  'data-[pressed]:scale-[0.99]',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2',
  'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
];

export function navLinkStyles() {
  return cn(navBase, linkRacDataAttrs);
}
