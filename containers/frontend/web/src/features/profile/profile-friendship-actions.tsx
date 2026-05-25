'use client';

import { useTranslations } from 'next-intl';

import { Button, CountBadge, DynamicInternalLink, Stack, Text } from '@components';

import type { FriendshipAction } from '@/features/social/friendship-actions/friendship-actions.types';
import type { FriendshipActionKey } from '@/features/social/friendship-actions/friendship-actions.types';

const classNameByAction: Partial<Record<FriendshipActionKey, string>> = {
  acceptRequest: 'bg-success text-white',
  rejectRequest: 'border-danger text-danger bg-transparent',
  cancelRequest: 'border-danger text-danger bg-transparent',
  deleteFriend: 'border-danger text-danger bg-transparent',
};

const variantByAction: Partial<Record<FriendshipActionKey, 'primary' | 'secondary' | 'cta'>> = {
  message: 'cta',
  acceptRequest: 'primary',
  rejectRequest: 'secondary',
  cancelRequest: 'secondary',
  deleteFriend: 'secondary',
};

interface ProfileFriendshipActionsProps {
  actions: FriendshipAction[];
}

export function ProfileFriendshipActions({ actions }: ProfileFriendshipActionsProps) {
  const tErrors = useTranslations('errors');

  return (
    <Stack gap="sm">
      {actions.map((action) => {
        const variant = variantByAction[action.key] ?? 'secondary';
        const className = classNameByAction[action.key];

        if (action.type === 'link') {
          return (
            <DynamicInternalLink
              key={action.key}
              as="button"
              href={action.href}
              variant={variant}
              className={`${className ?? ''} relative`}
            >
              <span className="inline-flex items-center gap-2">
                <span>{action.label}</span>
                <CountBadge count={action.badgeCount} />
              </span>
            </DynamicInternalLink>
          );
        }

        return (
          <div key={action.key} className="w-full">
            <Button
              onPress={action.onPress}
              variant={variant === 'cta' ? 'primary' : variant}
              className={className}
            >
              {action.label}
            </Button>

            {action.error && (
              <Text variant="caption" color="danger" className="w-full text-end">
                {tErrors(action.error.code)}
              </Text>
            )}
          </div>
        );
      })}
    </Stack>
  );
}
