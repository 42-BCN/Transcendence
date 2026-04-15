import type { ReactNode } from 'react';
import { Stack } from '../../primitives/stack';
import { Text } from '../../primitives/text';
import { Avatar } from '../../primitives/avatar';
import { userItemStyles } from './user-item.styles';

export type UserItemProps = {
  avatarUrl?: string | null;
  username: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function UserItem({ avatarUrl, username, subtitle, actions, className }: UserItemProps) {
  return (
    <Stack direction="horizontal" align="start" gap="sm" className={userItemStyles({ className })}>
      <Avatar src={avatarUrl} size="md" className="shrink-0" />

      <Stack gap="none" className="flex-grow pt-[1px]">
        <Text variant="body-sm" className="font-bold text-text-primary">
          {username}
        </Text>
        {subtitle && (
          <Text variant="caption" color="tertiary">
            {subtitle}
          </Text>
        )}
      </Stack>

      {actions && (
        <Stack direction="horizontal" gap="sm" align="center">
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
