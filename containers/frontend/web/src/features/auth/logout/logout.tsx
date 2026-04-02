'use client';

import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';
import { useTranslations } from 'next-intl';

export function Logout() {
  const t = useTranslations('auth');
  return (
    <Button w="default" onPress={logoutAction}>
      {t('logout')}
    </Button>
  );
}
