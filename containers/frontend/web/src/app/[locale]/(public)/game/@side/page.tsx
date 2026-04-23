'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, IconButton } from '@components';
import { ChatFeature } from '@/features/chat';

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <>
      <IconButton
        onPress={() => setChatVisible((v) => !v)}
        icon="messages"
        label={chatVisible ? t('hideChat') : t('showChat')}
        className="absolute bottom-4 right-4 z-20 pointer-events-auto"
      />

      <ChatFeature isVisible={chatVisible} />
    </>
  );
}
