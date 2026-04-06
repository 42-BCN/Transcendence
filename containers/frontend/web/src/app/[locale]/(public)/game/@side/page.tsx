'use client';
import { useState } from 'react';

import { Button } from '@components';
import { ChatFeature } from '@/features/chat';

export default function GameSidePage() {
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <Button onPress={() => setChatVisible((v) => !v)} w="auto">
          {chatVisible ? 'Hide Chat' : 'Show Chat'}
        </Button>
      </div>
      <ChatFeature isVisible={chatVisible} />
    </>
  );
}
