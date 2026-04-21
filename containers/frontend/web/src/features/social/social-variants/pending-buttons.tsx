import { useTranslations } from 'next-intl';
import { IconButton } from '@components';

export function PendingButton({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <IconButton
      label={tActions('reject')}
      icon="close"
      className="text-red-500 border-red-500"
      onPress={() => console.log(username)}
    />
  );
}
