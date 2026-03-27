import { cn } from '@/lib/styles/cn';

const groupBase = ['flex  w-6'];

const itemBase = [
  'relative inline-flex items-center justify-center min-w-6 min-h-6 text-xs font-medium',
  'border border-black',
  'first:rounded-s-md last:rounded-e-md',
  '[&:not(:first-child)]:border-s-0',
  'text-black bg-white',
  'transition-colors',
  'focus-visible:outline-none',
  'overflow-hidden',
];

const itemRACState = [
  'data-[hovered]:bg-black data-[hovered]:text-white',
  'data-[selected]:bg-black data-[selected]:text-white ',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
];

const indicatorBase = ['absolute inset-0', 'bg-black'];

const indicatorRACState = ['data-[selected]:opacity-100 opacity-0 transition-opacity'];

const labelBase = 'relative z-10';

export const segmentedControlGroupStyles = {
  group: () => cn(groupBase),
  item: () => cn(itemBase, itemRACState),
  indicator: () => cn(indicatorBase, indicatorRACState),
  label: () => cn(labelBase),
};
