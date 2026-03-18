import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export type ChatHeaderProps = {
  room: string;
  participants: string[];
};

export function ChatHeader(props: ChatHeaderProps) {
  const { room, participants } = props;
  return (
    <Stack gap="sm" className="px-4 py-3 rounded-xl rounded-b-none shadow-md">
      <Text as="h2" variant="heading-sm">
        {room}
      </Text>
      <Text as="p" variant="body-xs">
        {participants.join(', ')}
      </Text>
    </Stack>
  );
}
