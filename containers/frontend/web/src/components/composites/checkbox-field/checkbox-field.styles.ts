import { cn } from '@/lib/styles/cn';
import type { ClassValue } from 'clsx';

export const checkboxFieldStyles = {
  root: (className?: ClassValue) => cn('flex flex-col gap-1.5', className),
  error: () => 'font-body-xs text-red-600 mt-1 ml-5',
};
