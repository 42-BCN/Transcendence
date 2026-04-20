import { cn } from '@/lib/styles/cn';

const formBase = 'flex flex-col gap-4 min-w-[320px]';

export function formStyles(className?: string) {
  return cn(formBase, className);
}
