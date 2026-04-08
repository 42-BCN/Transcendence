import { cn } from '@/lib/styles/cn';

export const checkboxStyles = {
  root: (className?: string | ((values: any) => string), values?: any) =>
    cn(
      'group flex items-center gap-2 cursor-pointer select-none py-0.5',
      typeof className === 'function' ? className(values) : className,
    ),
  box: ({ isInvalid }: { isInvalid?: boolean } = {}) =>
    cn(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200',
      'border-border-primary bg-white/5 backdrop-blur-sm',
      'group-hover:border-border-secondary group-hover:bg-white/10',
      'group-data-[selected=true]:border-text-primary group-data-[selected=true]:bg-text-primary',
      'group-data-[focus-visible=true]:ring-1 group-data-[focus-visible=true]:ring-text-primary group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-bg-primary',
      isInvalid && 'border-red-600/50 bg-red-600/10',
    ),
  icon: ({ isSelected }: { isSelected?: boolean } = {}) =>
    cn(
      'h-2.5 w-2.5 text-bg-primary transition-all duration-200 scale-50 opacity-0',
      isSelected && 'opacity-100 scale-100',
    ),
  label: () =>
    'text-xs font-medium text-text-tertiary group-hover:text-text-secondary transition-colors duration-200 leading-tight',
};
