import type { ReactNode } from 'react';
import { SplitScreenGrid } from '@components/primitives/split-screen-grid';

type GameLayoutProps = {
  children: ReactNode;
};

export default function GameLayout({ children }: GameLayoutProps) {
  return <SplitScreenGrid>{children}</SplitScreenGrid>;
}
