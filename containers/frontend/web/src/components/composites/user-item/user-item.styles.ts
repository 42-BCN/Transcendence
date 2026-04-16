import { cn } from '@/lib/styles/cn';

const userItemBase = 'w-full px-4 py-2';

export function userItemStyles({ className }: { className?: string } = {}) {
  return cn(userItemBase, className);
}
