import { cn } from '@/lib/styles/cn';

export function resendStyles() {
  return cn('mt-8');
}

export function feedbackStyles(variant: 'success' | 'error') {
  return cn(
    'mt-2 text-sm',
    variant === 'success' && 'text-green-500',
    variant === 'error' && 'text-red-500',
  );
}
