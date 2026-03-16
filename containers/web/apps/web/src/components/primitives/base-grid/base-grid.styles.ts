import { cn } from '@/lib/styles/cn';
import styles from './base-grid.module.css';

const gridBase = ['pointer-events-none fixed inset-0'];

const grid8 = [styles['grid-8']];

const grid4 = [styles['grid-4']];

const col12 = ['mx-3 grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-3'];

const col = ['h-full bg-green-500/10 outline outline-1 outline-green-500/20'];

const colsResponsive = (index: number) => {
  return cn(col, 'block', index >= 4 && 'hidden md:block', index >= 8 && 'md:hidden lg:block');
};

export const baseGridStyles = {
  gridBase: cn(gridBase),
  grid4pt: cn(gridBase, grid4),
  grid8pt: cn(gridBase, grid8),
  gridCols: cn(col12),
  colsResponsive,
};
