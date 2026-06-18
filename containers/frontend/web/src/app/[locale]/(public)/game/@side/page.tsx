'use client';
import { useEffect, useState, useContext } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@components';
import { cn } from '@/lib/styles/cn';
import { ChatFeature } from '@/features/chat';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useGameChatUi } from '@/features/game/game-chat-ui.context';
import {
  MOBILE_MENU_CLOSE_EVENT,
  MOBILE_MENU_OPEN_EVENT,
} from '@/features/navigation/mobile-menu.events';
import { RoomsStoreContext, type RoomsStore } from '@/features/rooms/rooms-provider';
import { useGame } from '@/features/game/store';
import { gameSidePageStyles } from './page.styles';
import { GameInstructions } from '@/features/game/game-instructions';

function getIsOverlayActive(
  connectionError: string | null,
  isRoomFull: boolean,
  mapWidth: number,
  activePlayers: string[] | null | undefined,
  hasMapBounds: boolean,
  phase: string,
) {
  if (connectionError) return true;
  if (!isRoomFull) return true;
  const activePlayersCount = activePlayers?.length ?? 0;
  if (mapWidth > 0 && activePlayersCount < 4) return true;
  if (!hasMapBounds || mapWidth === 0) return true;
  return phase === 'WIN' || phase === 'LOSE';
}


function getIsRoomFull(roomsStore: RoomsStore | null) {
  return roomsStore?.roomState?.isGameRoomFull ?? false;
}

function useMobileMenuEffects(
  setChatVisible: (v: boolean) => void,
  setIsMenuOpen: (v: boolean) => void,
) {
  useEffect(() => {
    const closeChat = () => setChatVisible(false);
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    window.addEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);
    window.addEventListener(MOBILE_MENU_OPEN_EVENT, openMenu);
    window.addEventListener(MOBILE_MENU_CLOSE_EVENT, closeMenu);

    return () => {
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, openMenu);
      window.removeEventListener(MOBILE_MENU_CLOSE_EVENT, closeMenu);
    };
  }, [setChatVisible, setIsMenuOpen]);
}

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isChatVisible = chatVisible;

  const chatUi = useGameChatUi();
  const setChatOpen = chatUi?.setChatOpen;

  const roomsStore = useContext(RoomsStoreContext);
  const isOverlayActive = getIsOverlayActive(
    useGame((state) => state.connectionError),
    getIsRoomFull(roomsStore),
    useGame((state) => state.mapBounds.width),
    useGame((state) => state.activePlayers),
    Boolean(useGame((state) => state.mapBounds)),
    useGame((state) => state.phase),
  );

  const isChatOpen = !isOverlayActive && isChatVisible;

  useEffect(() => {
    setChatOpen?.(isChatOpen);
  }, [isChatOpen, setChatOpen]);

  useMobileMenuEffects(setChatVisible, setIsMenuOpen);

  return (
    <>
      {!isMenuOpen && !isOverlayActive && (
        <>
          <IconButton
            onPress={() => setChatVisible((v) => !v)}
            icon="messages"
            label={isChatVisible ? t('hideChat') : t('showChat')}
            className={gameSidePageStyles.toggleButton}
            placement="left"
          />
          <div className={gameSidePageStyles.helpButton}>
            <GameInstructions />
          </div>
        </>
      )}

      {!isOverlayActive && (
        <div
          className={cn(
            gameSidePageStyles.chatWrapper,
            isChatVisible ? gameSidePageStyles.chatWrapperActive : gameSidePageStyles.chatWrapperInactive,
          )}
        >
          <ChatFeature isVisible={isChatVisible} />
        </div>
      )}
    </>
  );
}
