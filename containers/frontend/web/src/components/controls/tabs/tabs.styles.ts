import { cn } from '@/lib/styles/cn';

const tabListBase = 'flex border-b border-border-primary gap-8';

const tabBase = [
  'relative pb-2 cursor-pointer outline-none transition duration-200',
  'text-text-secondary data-[hovered]:text-text-primary',
  'data-[selected]:text-text-primary data-[selected]:font-bold',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2',
];

const indicatorBase = [
  'absolute bottom-[-1px] left-0 right-0 h-[3px] bg-text-primary rounded-t-full',
  'transition-opacity duration-200',
  'opacity-0 data-[selected]:opacity-100',
];

export const tabsStyles = {
  tabList: (className?: string) => cn(tabListBase, className),
  tab: (className?: string) => cn(tabBase, className),
  indicator: (className?: string) => cn(indicatorBase, className),
  panel: (className?: string) => cn('mt-4 outline-none', className),
};
