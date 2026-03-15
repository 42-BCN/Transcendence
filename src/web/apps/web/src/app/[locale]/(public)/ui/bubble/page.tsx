import { MessageBubble } from '@components/primitives/message-bubble';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function ScrollAreaPage() {
  return (
    <Stack className="p-4">
      <Text as="h1" variant="heading-lg">
        Bubble message
      </Text>

      <div className="h-[400px] w-[400px]">
        <MessageBubble>
          <Text as="h2" variant="caption">
            John Doe
          </Text>
          <Text as="p">Hello! My name is ...</Text>
        </MessageBubble>
      </div>
    </Stack>
  );
}
