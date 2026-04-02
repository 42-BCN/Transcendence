import { cn } from '@/lib/styles/cn';
import { glassCardStyles } from '@components/primitives/glass-card/glass-card.styles';

const groupBase = ['inline-flex'];

const itemBase = [
  'relative inline-flex items-center justify-center min-w-6 min-h-6 text-xs font-medium',
  'rounded-none p-0 ', // todo glasscards padding is applied which is not ideal, we should be able to control it from here

  'first:rounded-s-md last:rounded-e-md',
  '[&:not(:first-child)]:border-s-0',
  'text-text-primary',
  'transition-colors',
  'focus-visible:outline-none',
  'overflow-hidden',
];

const itemRACState = [
  'data-[hovered]:bg-black data-[hovered]:text-white dark:data-[hovered]:bg-white dark:data-[hovered]:text-black',
  'data-[selected]:bg-black data-[selected]:text-white dark:data-[selected]:bg-white dark:data-[selected]:text-black',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
];

const indicatorBase = ['absolute inset-0', 'bg-black dark:bg-white'];

const indicatorRACState = ['data-[selected]:opacity-100 opacity-0 transition-opacity'];

const labelBase = 'relative z-10';

export const segmentedControlGroupStyles = {
  group: () => cn(groupBase),
  item: () =>
    cn(glassCardStyles({ blur: 'sm', intensity: 'low', border: 'low' }), itemBase, itemRACState),
  indicator: () => cn(indicatorBase, indicatorRACState),
  label: () => cn(labelBase),
};
