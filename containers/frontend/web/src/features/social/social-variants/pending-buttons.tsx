import { useTranslations } from 'next-intl';
import { IconButton } from '@/components/composites/icon-button/icon-button';
import { useSocialData } from '../hooks/use-social-data';

export function PendingButton({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const { handleDelete } = useSocialData();

  return (
    <IconButton
      label={tActions('reject')}
      icon="close"
      className="text-red-500 border-red-500"
      onPress={() => handleDelete(friendshipId)}
    />
  );
}
