'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@components';
import { ChatFeature } from '@/features/chat';
import { MOBILE_MENU_OPEN_EVENT } from '@/features/navigation/mobile-menu.events';
import { gameSidePageStyles } from './page.styles';

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const closeChat = () => {
      setChatVisible(false);
    };

    window.addEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);

    return () => {
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, closeChat);
    };
  }, []);

  return (
    <>
      <IconButton
        onPress={() => setChatVisible((v) => !v)}
        icon="messages"
        label={chatVisible ? t('hideChat') : t('showChat')}
        className={gameSidePageStyles.toggleButton}
      />

      <div className={gameSidePageStyles.chatWrapper}>
        <ChatFeature isVisible={chatVisible} />
      </div>
    </>
  );
}
