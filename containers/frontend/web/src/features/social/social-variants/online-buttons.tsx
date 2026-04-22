import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
export function OnlineButtons({
  username,
  friendshipId,
}: {
  username: string;
  friendshipId: string;
}) {
  const tActions = useTranslations('features.social.actions');

  return (
    <>
      <IconButton label={tActions('chat')} icon="messages" onPress={() => console.log(username)} />
      <IconButton
        label={tActions('inviteToGame')}
        icon="gamepad"
        onPress={() => console.log(friendshipId)}
      />
    </>
  );
}
