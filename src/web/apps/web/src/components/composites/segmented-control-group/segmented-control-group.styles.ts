import { cn } from '@/lib/styles/cn';

const groupBase = ['inline-flex items-stretch', 'border border-black'];

const itemBase = [
  'relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium',
  'border-r border-black last:border-r-0',
  'text-black bg-white',
  'transition-colors',
  'focus-visible:outline-none',
];

const itemRACState = [
  'data-[hovered]:bg-black data-[hovered]:text-white',
  'data-[selected]:bg-black data-[selected]:text-white',
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
