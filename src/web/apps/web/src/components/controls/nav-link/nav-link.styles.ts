import { cn } from '@/lib/styles/cn';

const navBase = [
  // layout
  'inline-flex items-center rounded-md px-3 py-2 text-sm',
  // behavior
  'transition outline-none',
  // default visual - will be overrided
  'opacity-80',
];

const linkRacDataAttrs = [
  'data-[current]:font-semibold data-[current]:opacity-100',
  'data-[hovered]:opacity-100',
  'data-[pressed]:scale-[0.99]',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2',
  'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
];

export function navLinkClass() {
  return cn(navBase, linkRacDataAttrs);
}
