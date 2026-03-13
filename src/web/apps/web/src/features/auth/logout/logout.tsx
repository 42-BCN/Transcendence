'use client';

// import { Form } from '@components/composites/form';
import { Button } from '@components/controls/button';
import { logoutAction } from './logout.action';

export function Logout() {
  return (
    // <Form onSubmit={() => logoutAction()}>
    <Button w="default" onPress={logoutAction}>
      Log out
    </Button>
    // </Form>
  );
}
