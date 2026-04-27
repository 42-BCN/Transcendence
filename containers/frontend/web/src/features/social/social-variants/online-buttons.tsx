import { useTranslations } from 'next-intl';
import { IconButton } from '@components';

export function OnlineButtons({ username, userId }: { username: string; userId: string }) {
  const tActions = useTranslations('features.social.actions');

  return (
    <>
      <IconButton label={tActions('chat')} icon="messages" onPress={() => console.log(userId)} />
      <IconButton
        label={tActions('inviteToGame')}
        icon="gamepad"
        onPress={() => console.log(userId)}
      />
    </>
  );
}
