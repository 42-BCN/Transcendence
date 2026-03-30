import { cn } from '@/lib/styles/cn';

const iconBase = `
  shrink-0
  inline-block
`;

export const iconStyles = {
  icon: (className?: string) => cn(iconBase, className),
};
