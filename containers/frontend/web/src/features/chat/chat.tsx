'use client';

import { useState } from 'react';

import { Stack } from '@components/primitives/stack';
import { ChatHeader } from './chat.header';

import { TextAreaField } from '@components/composites/text-area-field';
import { chatStyles } from './chat.styles';
import { ChatMain } from './chat.main';
import { CHAT_MESSAGES } from './chat.store';

export type Message = {
  id: string;
  username: string;
  content: {
    text: string;
  };
};

export function ChatFeature() {
  const [messages] = useState<Message[]>(CHAT_MESSAGES);
  const [value, setValue] = useState('');

  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <Stack gap="none" className={chatStyles.wrapper}>
      <ChatHeader room="chatTest" participants={['capapes', 'cmanica-', 'mfontser', 'mvelazqu']} />
      <ChatMain messages={messages} />
      <TextAreaField
        value={value}
        onChange={handleChange}
        className={chatStyles.footer.input}
        aria-label="message"
        maxLength={300}
      />
    </Stack>
  );
}
