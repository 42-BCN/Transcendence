import { ScrollArea } from '@components/primitives/scroll-area';
import { MessageBubble } from '@components/primitives/message-bubble';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
import type { Message } from './chat';
import { chatStyles } from './chat.styles';

export function ChatMain({ messages }: { messages: Message[] }) {
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
      </Stack>
    </ScrollArea>
  );
}
