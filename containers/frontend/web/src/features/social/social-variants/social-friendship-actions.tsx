'use client';

import { useTranslations } from 'next-intl';

import { IconButton, Text } from '@components';

import { useFriendshipActions } from '../friendship-actions/use-friendship-actions';
import { iconByAction } from '../friendship-actions/friendship-actions.icons';
import type {
  FriendshipAction,
  FriendshipActionKey,
} from '../friendship-actions/friendship-actions.types';

const classNameByAction: Partial<Record<FriendshipActionKey, string>> = {
  acceptRequest: 'bg-success text-white',
  rejectRequest: 'border-danger text-danger bg-transparent',
  cancelRequest: 'border-danger text-danger bg-transparent',
  deleteFriend: 'border-danger text-danger bg-transparent',
};

interface SocialFriendshipActionsProps {
  userId: string;
  username: string;
}

type ButtonAction = Extract<FriendshipAction, { type: 'button' }>;

function isButtonAction(action: FriendshipAction): action is ButtonAction {
  return action.type === 'button';
}

export function SocialFriendshipActions({ userId, username }: SocialFriendshipActionsProps) {
  const tErrors = useTranslations('errors');
  const actions = useFriendshipActions({ userId, username }).filter(isButtonAction);

  return (
    <>
      {actions.map((action) => (
        <FriendshipIconAction key={action.key} action={action} tErrors={tErrors} />
      ))}
    </>
  );
}

function FriendshipIconAction({
  action,
  tErrors,
}: {
  action: ButtonAction;
  tErrors: (key: string) => string;
}) {
  return (
    <>
      <IconButton
        label={action.label}
        icon={iconByAction[action.key]}
        variant={action.key === 'acceptRequest' ? 'primary' : 'secondary'}
        className={classNameByAction[action.key]}
        onPress={action.onPress}
      />

      {action.error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(action.error.code)}
        </Text>
      )}
    </>
  );
}
