import type { ReactNode } from 'react';
import { ChatProvider } from '@/features/chat/chat.provider';
import { GameChatUiProvider } from '@/features/game/game-chat-ui.context';
import { GameLayoutClient } from './game-layout.client';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

type GameLayoutProps = {
  children: ReactNode;
  side: ReactNode;
};
export default function GameLayout({ children, side }: GameLayoutProps) {
  return (
    <ChatProvider>
      <GameChatUiProvider>
        <GameLayoutClient side={side}>{children}</GameLayoutClient>
      </GameChatUiProvider>
    </ChatProvider>
  );
}
