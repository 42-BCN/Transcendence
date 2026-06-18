import { type ReactNode } from 'react';
import {
  splitScreenGridStyles,
  type SplitScreenGridMobileSideLayout,
  type SplitScreenGridMobileStackMode,
} from './split-screen-grid.styles';

export type SplitScreenGridProps = {
  full: ReactNode;
  side?: ReactNode;
  mobileStackMode?: SplitScreenGridMobileStackMode;
  mobileSideLayout?: SplitScreenGridMobileSideLayout;
  mobileFullClassName?: string;
  mobileSideClassName?: string;
  mobileSideInteractive?: boolean;
};

export function SplitScreenGrid({
  full,
  side,
  mobileStackMode = 'full',
  mobileSideLayout = 'stack',
  mobileFullClassName,
  mobileSideClassName,
  mobileSideInteractive = false,
}: SplitScreenGridProps) {
  const styles = splitScreenGridStyles({
    mobileStackMode,
    mobileSideLayout,
    mobileFullClassName,
    mobileSideClassName,
    mobileSideInteractive,
  });

  return (
    <main className={styles.wrapper}>
      <div className={styles.full}>{full}</div>
      {side && <div className={styles.side}>{side}</div>}
    </main>
  );
}
