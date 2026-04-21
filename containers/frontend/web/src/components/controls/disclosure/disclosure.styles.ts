import { cn } from '@/lib/styles/cn';

const disclosureBase = ['border-b border-border-primary', 'outline-none'];

const disclosureTrigger = [
  'flex w-full items-center justify-between cursor-pointer transition-colors py-3',
  'text-text-secondary',
  'font-body-sm',
  'data-[hovered]:text-text-primary',
  'outline-none data-[focused]:ring-2 data-[focused]:rounded-sm data-[focused]:ring-blue-500',
];

const triggerContent = [
  'transition-all',
  'group-data-[expanded]:font-medium',
  'group-data-[expanded]:text-text-primary',
];

const iconAnimation = [
  'transition-transform duration-200 ease-out',
  'scale-y-100 group-data-[expanded]:scale-y-[-1] group-data-[expanded]:text-text-primary',
];

const panel = 'transition-all duration-200 ease-out';

export const disclosureStyles = {
  container: (className?: string) => cn('group', disclosureBase, className),
  trigger: (className?: string) => cn(disclosureTrigger, className),
  title: (className?: string) => cn(triggerContent, className),
  icon: (className?: string) => cn(iconAnimation, triggerContent, className),
  panel: (className?: string) => cn(panel, className),
};
