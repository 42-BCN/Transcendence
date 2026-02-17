import { cn } from '@/lib/styles/cn';

export const segmentedControlGroupStyles = {
  group: () =>
    cn(
      // layout
      'inline-flex items-stretch',
      // straight border container
      'border border-black',
    ),

  item: () =>
    cn(
      'relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium',
      // vertical separators
      'border-r border-black last:border-r-0',
      // base text
      'text-black bg-white',
      // interaction
      'transition-colors',
      'data-[hovered]:bg-black data-[hovered]:text-white',
      'data-[selected]:bg-black data-[selected]:text-white',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
      'focus-visible:outline-none',
    ),

  indicator: () =>
    cn(
      // fill entire button
      'absolute inset-0',
      // selected state
      'bg-black',
      'data-[selected]:opacity-100 opacity-0 transition-opacity',
    ),

  label: () => cn('relative z-10'),
};
