import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
import { useSocialData } from '../hooks/use-social-data';

export function RequestButtons({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const { handleResponse } = useSocialData();

  return (
    <>
      <IconButton
        label={tActions('reject')}
        icon="close"
        className="text-red-500 border-red-500"
        onPress={() => handleResponse(friendshipId, 'reject')}
      />
      <IconButton
        label={tActions('accept')}
        icon="check"
        className="text-green-500 border-green-500"
        onPress={() => handleResponse(friendshipId, 'accept')}
      />
    </>
  );
}
