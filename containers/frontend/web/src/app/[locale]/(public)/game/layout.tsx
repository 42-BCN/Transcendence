import type { ReactNode } from 'react';
import { SplitScreenGrid } from '@components/primitives/split-screen-grid';
import { ChatProvider } from '@/features/chat/chat.provider';

type GameLayoutProps = {
  children: ReactNode;
  side: ReactNode;
};
export default function GameLayout({ children, side }: GameLayoutProps) {
  return (
    <ChatProvider>
      <SplitScreenGrid full={children} side={side} />
    </ChatProvider>
  );
}
