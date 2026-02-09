import { cn } from '@/lib/styles/cn';

const formBase = 'flex flex-col gap-6';

export function formClass({ className }: { className?: string }) {
  return cn(formBase, className);
}
