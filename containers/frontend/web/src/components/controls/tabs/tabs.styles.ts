import { cn } from '@/lib/styles/cn';

const tabListBase = 'flex border-b border-border-primary gap-2';

const tabBase = [
  'relative p-2 cursor-pointer outline-none transition duration-200',
  'font-body-sm data-[hovered]:text-text-primary',
  'data-[selected]:font-bold',
  "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:rounded-t-full after:bg-text-primary after:content-['']",
  'after:transition-opacity after:duration-200 after:opacity-0 data-[selected]:after:opacity-100',
  'data-[focus-visible]:ring-2 data-[focus-visible]:rounded-sm data-[focus-visible]:ring-blue-500',
];

export const tabsStyles = {
  tabList: (className?: string) => cn(tabListBase, className),
  tab: (className?: string) => cn(tabBase, className),
  panel: (className?: string) => cn('outline-none', className),
};
