import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export type ChatHeaderProps = {
  room: string;
  participants: string[];
};

export function ChatHeader(props: ChatHeaderProps) {
  const { room, participants } = props;
  return (
    <Stack>
      <Text as="h2" variant="heading-md">
        {room}
      </Text>
      <Text as="p">{participants.join(', ')}</Text>
    </Stack>
  );
}
