import { useTranslations } from 'next-intl';
import { IconButton } from '@components';

export function RequestButtons({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <>
      <IconButton
        label={tActions('reject')}
        icon="close"
        className="text-red-500 border-red-500"
        onPress={() => console.log(username)}
      />
      <IconButton
        label={tActions('accept')}
        icon="check"
        variant="full"
        onPress={() => console.log(username)}
      />
    </>
  );
}
