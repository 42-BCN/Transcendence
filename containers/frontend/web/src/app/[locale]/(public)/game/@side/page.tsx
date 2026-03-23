'use client';
import { useState } from 'react';

import { Button } from '@components/controls/button';
import { gamePageButton } from './page.styles';
import { ChatFeature } from '@/features/chat';

export default function GameSidePage() {
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <>
      <Button onPress={() => setChatVisible((v) => !v)} className={gamePageButton} w="default">
        {chatVisible ? 'Hide Chat' : 'Show Chat'}
      </Button>
      {chatVisible && <ChatFeature className="rounded-r-none" />}
    </>
  );
}
