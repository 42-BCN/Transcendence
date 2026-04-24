import { useTranslations } from 'next-intl';
import { IconButton } from '@components';

export function RequestButtons({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <>
      <IconButton
        label={tActions('reject')}
        icon="close"
        variant="secondary"
        className="text-danger border-danger"
        onPress={() => console.log(username)}
      />
      <IconButton
        label={tActions('accept')}
        icon="check"
        variant="primary"
        className="bg-success text-white"
        onPress={() => console.log(username)}
      />
    </>
  );
}
