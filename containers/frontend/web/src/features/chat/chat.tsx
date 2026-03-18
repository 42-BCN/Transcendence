import { useState } from 'react';

import { Stack } from '@components/primitives/stack';
import { ChatHeader } from './chat.header';
import { ScrollArea } from '@components/primitives/scroll-area';
import { MessageBubble } from '@components/primitives/message-bubble';
import { Text } from '@components/primitives/text';

type Message = {
  username: string;
  content: {
    text: string;
  };
};

export function ChatFeature() {
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <Stack>
      <ChatHeader room="chatTest" participants={['capapes', 'camanica', 'mfontser', 'mvelazqu']} />
      <ScrollArea>
        {messages.map((message) => (
          <MessageBubble>
            <Text as="h3" variant="caption">
              {message.username}
            </Text>
            <Text as="p">{message.content.text}</Text>
          </MessageBubble>
        ))}
      </ScrollArea>
    </Stack>
  );
}
