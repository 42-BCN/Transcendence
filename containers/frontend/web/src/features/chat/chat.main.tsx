import { useEffect, useRef } from 'react';

import { MessageBubble, ScrollArea, Stack, Text } from '@components';
import { chatStyles } from './chat.styles';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';
import type { DirectMessageError } from '@/contracts/sockets/direct-messages/direct-messages.schema';

type ChatMainMessage = (ChatMessageUnion | DirectMessageError) & {
  readAt?: number | null;
};

export function ChatMain({
  messages,
  initialUnreadMessageId,
}: {
  messages: ChatMainMessage[];
  initialUnreadMessageId?: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const didScrollToUnreadRef = useRef(false);

  useEffect(() => {
    if (initialUnreadMessageId && !didScrollToUnreadRef.current) {
      const target = document.getElementById(`message-${initialUnreadMessageId}`);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        didScrollToUnreadRef.current = true;
        return;
      }
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [initialUnreadMessageId, messages]);
  return (
    <ScrollArea>
      <Stack className={chatStyles.main.wrapper}>
        {messages.map(({ id, username, content, type }) => (
          <div key={id} id={`message-${id}`}>
            <MessageBubble variant={type}>
              {type === 'user' && (
                <Text as="h3" variant="caption">
                  {username}
                </Text>
              )}
              <Text as="p" variant="body-xs" className="whitespace-pre-wrap">
                {content.text}
              </Text>
            </MessageBubble>
          </div>
        ))}
        <div ref={bottomRef} />
      </Stack>
    </ScrollArea>
  );
}
