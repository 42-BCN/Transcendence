import { cn } from '@/lib/styles/cn';

const userItemBase = 'w-full py-3';

export function userItemStyles({ className }: { className?: string } = {}) {
  return cn(userItemBase, className);
}
