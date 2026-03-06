'use client';

import { Form } from '@components/composites/form';
import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';

export function Logout() {
  return (
    <Form onSubmit={() => logoutAction()}>
      <Button type="submit" w="default">
        Log out
      </Button>
    </Form>
  );
}
