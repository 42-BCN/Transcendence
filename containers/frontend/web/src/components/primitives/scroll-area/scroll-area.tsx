import type { HTMLAttributes } from 'react';

import { scrollAreaStyles } from './scroll-area.styles';

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'>;

export function ScrollArea({ children, ...rest }: ScrollAreaProps) {
  return (
    <div className={scrollAreaStyles()} {...rest}>
      {children}
    </div>
  );
}
