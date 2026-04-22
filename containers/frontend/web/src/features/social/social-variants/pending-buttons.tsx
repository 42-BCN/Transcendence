import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
import { useSocialActions } from '../hooks/use-social-actions';

export function PendingButton({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const { handleDelete } = useSocialActions();

  return (
    <IconButton
      label={tActions('reject')}
      icon="close"
      className="text-red-500 border-red-500"
      onPress={() => handleDelete(friendshipId)}
    />
  );
}
