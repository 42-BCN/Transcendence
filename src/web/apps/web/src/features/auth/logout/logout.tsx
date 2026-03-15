'use client';

import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';

export function Logout() {
  return (
    <Button w="default" onPress={logoutAction}>
      Log out
    </Button>
  );
}
