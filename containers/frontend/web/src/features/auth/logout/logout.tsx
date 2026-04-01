'use client';

import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';
import { useRouter } from '@/i18n/navigation';
import { Icon } from '@components/primitives/icon';

export function Logout() {
  const router = useRouter();
  const logoutHandler = async () => {
    const response = await logoutAction();
    if (!response.ok) {
      // TODO handle error
      console.error('Failed to log out');
    }

    router.push('/login');
    router.refresh();
  };
  const logoutIcon = <Icon name="logOut" />;
  return (
    // TODO add tooltip. Add on expanse. Unify Link and button styles
    <Button
      w="default"
      onPress={logoutHandler}
      icon={logoutIcon}
      variant="ghost"
      className="p-2"
      aria-label="Log out"
    />
  );
}
