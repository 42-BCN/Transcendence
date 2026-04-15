import { cn } from '@/lib/styles/cn';

const userItemBase = 'w-full py-2';

export function userItemStyles({ className }: { className?: string } = {}) {
  return cn(userItemBase, className);
}
