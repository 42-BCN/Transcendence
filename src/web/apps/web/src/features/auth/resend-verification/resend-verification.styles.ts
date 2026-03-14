import { cn } from '@/lib/styles/cn';

export function feedbackStyles(variant: 'success' | 'error') {
  return cn(
    'text-sm',
    variant === 'success' && 'text-green-500',
    variant === 'error' && 'text-red-500',
  );
}
