import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { chatStyles } from './chat.styles';

export type ChatHeaderProps = {
  room: string;
  participants: string[];
};

export function ChatHeader(props: ChatHeaderProps) {
  const { room, participants } = props;
  return (
    <Stack gap="sm" className={chatStyles.header.wrapper}>
      <Text as="h2" variant="heading-sm">
        {room}
      </Text>
      <Text as="p" variant="body-xs">
        {participants.join(', ')}
      </Text>
    </Stack>
  );
}
