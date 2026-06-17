'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@components';
import { ChatFeature } from '@/features/chat';
import {
  MOBILE_MENU_CLOSE_EVENT,
  MOBILE_MENU_OPEN_EVENT,
} from '@/features/navigation/mobile-menu.events';
import { gameSidePageStyles } from './page.styles';
import { GameInstructions } from '@/features/game/game-instructions';

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {!isMenuOpen && (
        <>
          <IconButton
            onPress={() => setChatVisible((v) => !v)}
            icon="messages"
            label={chatVisible ? t('hideChat') : t('showChat')}
            className={gameSidePageStyles.toggleButton}
            placement="left"
          />
          <div className={gameSidePageStyles.helpButton}>
            <GameInstructions />
          </div>
        </>
      )}

      <div className={gameSidePageStyles.chatWrapper}>
        <ChatFeature isVisible={chatVisible} />
      </div>
    </>
  );
}
