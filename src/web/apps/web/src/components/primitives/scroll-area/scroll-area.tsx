import type { ReactNode } from 'react';
 import { scrollAreaStyles } from './scroll-area.styles';

export type ScrollAreaProps = {
  children?: ReactNode;
};

export function ScrollArea({ children }: ScrollAreaProps) {
  return (
    <div className={scrollAreaStyles()}>
      {children}
    </div>
  );
}
