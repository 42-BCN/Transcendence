import { useEffect, useRef } from 'react';

import { ScrollArea } from '@components/primitives/scroll-area';
import { MessageBubble } from '@components/primitives/message-bubble';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
import { chatStyles } from './chat.styles';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';

export function ChatMain({ messages }: { messages: ChatMessageUnion[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <ScrollArea>
      <Stack className={chatStyles.main.wrapper}>
        {messages.map(({ id, username, content, type }) => (
          <MessageBubble key={id} variant={type}>
            {type === 'user' && (
              <Text as="h3" variant="caption">
                {username}
              </Text>
            )}
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
