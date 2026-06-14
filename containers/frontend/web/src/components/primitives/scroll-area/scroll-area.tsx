import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/styles/cn';
import { scrollAreaStyles } from './scroll-area.styles';

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement>;

export function ScrollArea({ children, className, ...rest }: ScrollAreaProps) {
  return (
    <div className={cn(scrollAreaStyles(), className)} {...rest}>
      {children}
    </div>
  );
}
