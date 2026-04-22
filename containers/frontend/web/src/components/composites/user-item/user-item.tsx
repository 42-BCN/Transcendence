import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
import { userItemStyles } from './user-item.styles';

export type UserItemProps = {
  avatarUrl?: string | null;
  username: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function UserItem({ avatarUrl, username, subtitle, children, className }: UserItemProps) {
  return (
    <Stack direction="horizontal" align="center" gap="sm" className={userItemStyles({ className })}>
      <Avatar src={avatarUrl} size="md" />

      <div className="flex-1 self-start">
        <Text variant="body-sm" as="p" className="font-bold">
          {username}
        </Text>
        {/* {subtitle && (
          <Text variant="caption" as="p" color="tertiary">
            {subtitle}
          </Text>
        )} */}
      </div>

      {children}
    </Stack>
  );
}
