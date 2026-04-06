'use client';

import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';
import { useRouter } from '@/i18n/navigation';
import { Icon } from '@components/primitives/icon';
import { useTranslations } from 'next-intl';

export function Logout({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  const t = useTranslations('features.auth.actions');
  const logoutHandler = async () => {
    const { data } = await logoutAction();
    if (!data.ok) {
      // TODO handle error
      console.error('Failed to log out');
    }

    router.push('/login');
    router.refresh();
    onPress?.();
  };
  const logoutIcon = <Icon name="logOut" />;
  return (
    // TODO add tooltip. Add on expanse. Unify Link and button styles
    <Button
      w="auto"
      onPress={logoutHandler}
      icon={logoutIcon}
      variant="ghost"
      className="p-2"
      aria-label={t('logoutAriaLabel')}
    />
  );
}
