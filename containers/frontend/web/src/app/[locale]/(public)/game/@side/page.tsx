'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@components';
import { ChatFeature } from '@/features/chat';

export default function GameSidePage() {
  const t = useTranslations('features.chat');
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <>
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <Button onPress={() => setChatVisible((v) => !v)} w="auto">
          {chatVisible ? t('hideChat') : t('showChat')}
        </Button>
      </div>
      <ChatFeature isVisible={chatVisible} />
    </>
  );
}
