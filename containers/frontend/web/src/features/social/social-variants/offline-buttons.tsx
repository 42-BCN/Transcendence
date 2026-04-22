import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
import { useSocialData } from '../hooks/use-social-data';

export function OfflineButtons({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');

  return (
    <IconButton
      label={tActions('chat')}
      icon="messages"
      onPress={() => console.log(friendshipId)}
    />
  );
}
