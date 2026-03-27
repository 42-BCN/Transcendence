import { type ReactNode } from 'react';
import { splitScreenGridStyles } from './split-screen-grid.styles';

export type SplitScreenGridProps = {
  full: ReactNode;
  side?: ReactNode;
};

export function SplitScreenGrid({ full, side }: SplitScreenGridProps) {
  return (
    <main className={splitScreenGridStyles.wrapper}>
      <div className="absolute z-0 inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className={splitScreenGridStyles.full}>{full}</div>
      {side && <div className={splitScreenGridStyles.side}>{side}</div>}
    </main>
  );
}
