import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
import { useSocialActions } from '../hooks/use-social-actions';
import { RejectActionButton } from './reject-action-button';

export function RequestButtons({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const { handleResponse } = useSocialActions();

  return (
    <>
      <RejectActionButton friendshipId={friendshipId} type="pendingReceived" />
      <IconButton
        label={tActions('accept')}
        icon="check"
        className="text-green-500 border-green-500"
        onPress={() => handleResponse(friendshipId, 'accept')}
      />
    </>
  );
}
