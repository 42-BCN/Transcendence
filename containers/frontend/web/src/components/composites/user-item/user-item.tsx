import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
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
      <Avatar src={avatarUrl} size="md" />

      <div className="flex-grow flex flex-col pt-[1px]">
        <Text variant="body-sm" as="p" className="font-bold">
          {username}
        </Text>
        {subtitle && (
          <Text variant="caption" as="p" color="tertiary">
            {subtitle}
          </Text>
        )}
      </div>

      {actions && <div className="flex gap-2 self-center">{actions}</div>}
    </Stack>
  );
}
