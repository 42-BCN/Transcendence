'use client';

import { Button, DynamicInternalLink, Stack } from '@components';

import type { FriendshipAction } from '@/features/social/friendship-actions/friendship-actions.types';

interface ProfileFriendshipActionsProps {
  actions: FriendshipAction[];
}

export function ProfileFriendshipActions({ actions }: ProfileFriendshipActionsProps) {
  return (
    <Stack gap="sm">
      {actions.map((action) =>
        action.type === 'link' ? (
          <DynamicInternalLink key={action.key} as="button" href={action.href} className="w-full">
            {action.label}
          </DynamicInternalLink>
        ) : (
          <Button key={action.key} onPress={action.onPress} className="w-full">
            {action.label}
          </Button>
        ),
      )}
    </Stack>
  );
}
