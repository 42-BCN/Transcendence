import { useTranslations } from 'next-intl';
import { IconButton } from '@components';

export function OfflineButtons({ userId }: { userId: string }) {
  const tActions = useTranslations('features.social.actions');

  return (
    <IconButton label={tActions('chat')} icon="messages" onPress={() => console.log(userId)} />
  );
}
