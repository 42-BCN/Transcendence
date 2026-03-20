import { type ReactNode } from 'react';
import { splitScreenGridStyles } from './split-screen-grid.styles';

export type SplitScreenGridProps = {
  full: ReactNode;
  side?: ReactNode;
};

export function SplitScreenGrid({ full, side }: SplitScreenGridProps) {
  return (
    <main className={splitScreenGridStyles.wrapper}>
      <div className={splitScreenGridStyles.full}>{full}</div>
      {side && <div className={splitScreenGridStyles.side}>{side}</div>}
    </main>
  );
}
