import { useEffect, useRef } from 'react';

import { ScrollArea } from '@components/primitives/scroll-area';
import { MessageBubble } from '@components/primitives/message-bubble';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
import { chatStyles } from './chat.styles';

export type Message = {
  id: string;
  username: string;
  content: {
    text: string;
  };
};

export function ChatMain({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <ScrollArea>
      <Stack className={chatStyles.main.wrapper}>
        {messages.map(({ id, username, content }) => (
          <MessageBubble key={id} variant={username === 'capapes' ? 'default' : 'reverse'}>
            <Text as="h3" variant="caption">
              {username}
            </Text>
            <Text as="p" variant="body-xs">
              {content.text}
            </Text>
          </MessageBubble>
        ))}
        <div ref={bottomRef} />
      </Stack>
    </ScrollArea>
  );
}
