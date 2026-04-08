import { Stack, Text } from '@components';
import { chatStyles } from './chat.styles';

export type ChatHeaderProps = {
  room: string;
  participants: string[];
};

export function ChatHeader(props: ChatHeaderProps) {
  const { room, participants } = props;
  return (
    <Stack gap="xs" className={chatStyles.header.wrapper}>
      <Text as="h2" variant="heading-sm">
        {room}
      </Text>
      <Text as="p" variant="body-xs">
        {participants.join(', ')}
      </Text>
    </Stack>
  );
}
