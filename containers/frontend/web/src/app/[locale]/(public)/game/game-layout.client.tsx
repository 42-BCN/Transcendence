'use client';

import type { ReactNode } from 'react';

import { SplitScreenGrid } from '@components';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useGameChatUi } from '@/features/game/game-chat-ui.context';

type GameLayoutClientProps = {
  children: ReactNode;
  side: ReactNode;
};

export function GameLayoutClient({ children, side }: GameLayoutClientProps) {
  const chatUi = useGameChatUi();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  return (
    <div className="h-dvh w-full overflow-hidden lg:relative lg:h-auto lg:overflow-visible">
      <SplitScreenGrid
        full={children}
        side={side}
        mobileSideLayout="overlay"
        mobileSideInteractive={Boolean(isMobile && chatUi?.isChatOpen)}
      />
    </div>
  );
}
