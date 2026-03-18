import type { ReactNode } from 'react';
import { splitScreenGridStyles } from './split-screen-grid.styles';

export type SplitScreenGridProps = {
  children: ReactNode;
};

export function SplitScreenGrid({ children }: SplitScreenGridProps) {
  const wrapperClass = splitScreenGridStyles.wrapper();
  return <main className={wrapperClass}>{children}</main>;
}
