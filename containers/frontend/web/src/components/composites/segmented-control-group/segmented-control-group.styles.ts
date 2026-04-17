import { cn } from '@/lib/styles/cn';

const groupBase = ['inline-flex'];

const itemBase = [
  'relative inline-flex items-center justify-center min-w-6 min-h-6 select-none border',
  'first:rounded-s-md last:rounded-e-md',
  '[&:not(:first-child)]:border-s-0',
  'text-text-primary',
  'transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-150 ease-out',
  'focus-visible:outline-none',
  'overflow-hidden border border-border-primary',
];

const itemRACState = ['data-[hovered]:bg-bg-secondary', 'data-[disabled]:cursor-not-allowed'];

const indicatorBase = ['absolute inset-0'];

const indicatorRACState = [
  'opacity-0 transition-opacity data-[selected]:bg-slate-950/15 dark:data-[selected]:bg-white/20 data-[selected]:opacity-100 ',
];

const labelBase = 'relative z-10';

export const segmentedControlGroupStyles = {
  group: () => cn(groupBase),
  item: () => cn(itemBase, itemRACState),
  indicator: () => cn(indicatorBase, indicatorRACState),
  label: () => cn(labelBase),
};
