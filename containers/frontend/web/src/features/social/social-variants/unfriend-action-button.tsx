'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Text, IconButton } from '@components';
import { useSocialStore } from '../store/social-store.provider';
import { deleteFriendship } from '../actions/friendships.actions';

import type { FriendshipsErrorName } from '@/contracts/api/friendships/friendships.errors';
import type { ApiErrorShape } from '@/contracts/api/http/response';

interface UnfriendActionButtonProps {
  friendshipId: string;
}

export function UnfriendActionButton({ friendshipId }: UnfriendActionButtonProps) {
  const tErrors = useTranslations('errors');
  const removeFriendById = useSocialStore((s) => s.removeFriendById);
  const [error, setError] = useState<
    ApiErrorShape<FriendshipsErrorName | 'VALIDATION_ERROR'> | undefined
  >(undefined);

  const handleClick = useCallback(
    async () => {
      setError(undefined);
      const response = await deleteFriendship(friendshipId);

      if (response.ok) {
        if (removeFriendById) {
          removeFriendById(friendshipId);
        }
      } else {
        setError(response.error);
      }
    },
    [friendshipId, removeFriendById],
  );

  return (
    <>
      <IconButton
        label="Eliminar amigo"
        icon="trash"
        variant="secondary"
        className="text-danger border-danger"
        onPress={handleClick}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(error.code as any)}
        </Text>
      )}
    </>
  );
}
