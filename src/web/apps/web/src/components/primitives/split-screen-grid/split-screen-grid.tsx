import type { ReactNode } from 'react';
import { splitScreenGridStyles } from './split-screen-grid.styles';

export type SplitScreenProps = {
  children: ReactNode;
};

export function SplitScreenGrid({ children }: SplitScreenProps) {
  const wrapperClass = splitScreenGridStyles.wrapper();
  return <main className={wrapperClass}>{children}</main>;
}
