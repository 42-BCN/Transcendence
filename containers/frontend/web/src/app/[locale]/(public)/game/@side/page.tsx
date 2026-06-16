'use client';
import { useEffect, useState, useContext } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@components';
import { ChatFeature } from '@/features/chat';
import {
  MOBILE_MENU_CLOSE_EVENT,
  MOBILE_MENU_OPEN_EVENT,
} from '@/features/navigation/mobile-menu.events';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import { useGame } from '@/features/game/store';
import { gameSidePageStyles } from './page.styles';

function getIsOverlayActive(
  connectionError: string | null,
  isRoomFull: boolean,
  mapWidth: number,
  activePlayersCount: number,
  hasMapBounds: boolean,
  phase: string,
) {
  if (connectionError) return true;
  if (!isRoomFull) return true;
  if (mapWidth > 0 && activePlayersCount < 4) return true;
  if (!hasMapBounds || mapWidth === 0) return true;
  if (phase === 'WIN' || phase === 'LOSE') return true;
  return false;
}

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roomsStore = useContext(RoomsStoreContext);
  const roomState = roomsStore?.roomState;
  const isRoomFull = roomState?.isGameRoomFull ?? false;

  const connectionError = useGame((state) => state.connectionError);
  const activePlayers = useGame((state) => state.activePlayers);
  const mapBounds = useGame((state) => state.mapBounds);
  const phase = useGame((state) => state.phase);

  const isOverlayActive = getIsOverlayActive(
    connectionError,
    isRoomFull,
    mapBounds.width,
    activePlayers?.length ?? 0,
    Boolean(mapBounds),
    phase,
  );

  useEffect(() => {
    const closeChat = () => {
      setChatVisible(false);
    };

    const openMenu = () => {
      setIsMenuOpen(true);
    };

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);
    window.addEventListener(MOBILE_MENU_OPEN_EVENT, openMenu);
    window.addEventListener(MOBILE_MENU_CLOSE_EVENT, closeMenu);

    return () => {
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, openMenu);
      window.removeEventListener(MOBILE_MENU_CLOSE_EVENT, closeMenu);
    };
  }, []);

  return (
    <>
      {!isMenuOpen && !isOverlayActive && (
        <IconButton
          onPress={() => setChatVisible((v) => !v)}
          icon="messages"
          label={chatVisible ? t('hideChat') : t('showChat')}
          className={gameSidePageStyles.toggleButton}
          placement="left"
        />
      )}

      {!isOverlayActive && (
        <div className={gameSidePageStyles.chatWrapper}>
          <ChatFeature isVisible={chatVisible} />
        </div>
      )}
    </>
  );
}
