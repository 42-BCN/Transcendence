import type { HTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/styles/cn';
import { scrollAreaStyles } from './scroll-area.styles';

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
};

export function ScrollArea({ children, className, ref, ...rest }: ScrollAreaProps) {
  return (
    <div ref={ref} className={cn(scrollAreaStyles(), className)} {...rest}>
      {children}
    </div>
  );
}
