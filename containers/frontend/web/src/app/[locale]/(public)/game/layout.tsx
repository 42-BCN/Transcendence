import type { ReactNode } from 'react';
import { SplitScreenGrid } from '@components/primitives/split-screen-grid';

type GameLayoutProps = {
  children: ReactNode;
  side: ReactNode;
};
export default function GameLayout({ children, side }: GameLayoutProps) {
  return <SplitScreenGrid full={children} side={side} />;
}
