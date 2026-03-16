import { MessageBubble } from '@components/primitives/message-bubble';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function MessageBubblePage() {
  return (
    <Stack className="p-4">
      <Text as="h1" variant="heading-lg">
        Bubble message
      </Text>

      <Stack className="h-[400px] w-[400px]">
        <MessageBubble>
          <Text as="h2" variant="caption">
            John Doe
          </Text>
          <Text as="p">Hello! My name is ...</Text>
        </MessageBubble>
        <MessageBubble variant="reverse">
          <Text as="h2" variant="caption">
            Jane Doe
          </Text>
          <Text as="p">Hello! this is a test for message preview</Text>
        </MessageBubble>
      </Stack>
    </Stack>
  );
}
