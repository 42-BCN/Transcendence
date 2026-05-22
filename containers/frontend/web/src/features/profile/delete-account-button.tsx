'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';

import { Button, Form, Stack, Text } from '@components';

import { deleteAccountAction } from './delete-account.action';

type DeleteAccountConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (nextOpen: boolean) => void;
};

function DeleteAccountConfirmDialog({
  isOpen,
  onOpenChange,
}: DeleteAccountConfirmDialogProps) {
  const t = useTranslations('features.profile');
  const tErrors = useTranslations('errors');
  const [state, formAction] = useActionState(deleteAccountAction, null);

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <Modal className="w-full max-w-md outline-none">
        <Dialog
          role="alertdialog"
          aria-label={t('delete.title')}
          className="rounded-2xl border border-border-primary bg-bg-primary p-5 shadow-[0_12px_40px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))] outline-none"
        >
          <Stack gap="sm">
            <Text as="h2" variant="body-lg" className="font-bold">
              {t('delete.title')}
            </Text>

            <Text variant="body-sm" className="text-text-secondary break-words">
              {t('delete.body')}
            </Text>

            {state && !state.ok ? (
              <Text variant="body-xs" className="text-danger">
                {tErrors(state.error.code)}
              </Text>
            ) : null}

            <Stack gap="sm" className="pt-2">
              <Form action={formAction} className="min-w-0 w-full md:w-full">
                <Button
                  type="submit"
                  variant="secondary"
                  className="border-danger text-danger bg-transparent"
                >
                  {t('actions.deleteAccount')}
                </Button>
              </Form>

              <Button type="button" variant="secondary" onPress={() => onOpenChange(false)}>
                {t('delete.cancel')}
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export function DeleteAccountButton() {
  const t = useTranslations('features.profile');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack gap="xs" className="mt-2">
      <Button
        type="button"
        variant="secondary"
        className="border-danger text-danger bg-transparent"
        onPress={() => setIsOpen(true)}
      >
        {t('actions.deleteAccount')}
      </Button>

      <DeleteAccountConfirmDialog isOpen={isOpen} onOpenChange={setIsOpen} />

      <Text variant="body-xs" className="text-text-secondary">
        {t('delete.description')}
      </Text>
    </Stack>
  );
}
