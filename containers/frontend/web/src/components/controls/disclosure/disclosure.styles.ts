import { cn } from '@/lib/styles/cn';

const disclosureBase = 'border-b border-border-primary/30';

export const disclosureStyles = {
  container: (className?: string) => cn('group', disclosureBase, className),
  trigger: (className?: string) =>
    cn(
      'flex w-full items-center justify-between py-5 cursor-pointer outline-none transition-colors',
      'text-text-secondary data-[hovered]:text-text-primary',
      'data-[expanded]:text-text-primary',
      'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2',
      className,
    ),
  title: (className?: string) =>
    cn(
      'text-base font-medium transition-all',
      'group-data-[expanded]:text-text-primary',
      className,
    ),
  icon: (className?: string) =>
    cn(
      'size-5 transition-transform duration-200 ease-out text-text-tertiary',
      'scale-y-[-1] group-data-[expanded]:scale-y-100 group-data-[expanded]:text-text-primary',
      className,
    ),
  panel: (className?: string) =>
    cn('pb-5 outline-none transition-all duration-200 ease-out', className),
};
