import { cn } from '@/lib/styles/cn';

const userItemBase = 'w-full p-3 flex-wrap';

export function userItemStyles({ className }: { className?: string } = {}) {
  return cn(userItemBase, className);
}
