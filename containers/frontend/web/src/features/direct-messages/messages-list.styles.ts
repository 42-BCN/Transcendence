import { cn } from '@/lib/styles/cn';

export const messagesListStyles = {
  wrapper: 'h-full w-full',
  title: 'p-3 font-bold',
  scroll: 'flex-1',
  emptyState: 'p-3 text-center',
  item: (isSelected: boolean) =>
    cn(
      'no-underline transition-colors',
      isSelected ? 'bg-slate-100/5' : 'hover:bg-gray-100/10',
    ),
};
