import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
import { PresenceBadge } from '@components/primitives/presence-badge';
import type { PresenceStatus } from '@components/primitives/presence-badge';
import { userItemStyles } from './user-item.styles';

export type UserItemProps = {
  avatarUrl?: string | null;
  username: string;
  subtitle?: string;
  presence?: PresenceStatus;
  children?: ReactNode;
  className?: string;
};

export function UserItem({
  avatarUrl,
  username,
  subtitle,
  presence,
  children,
  className,
}: UserItemProps) {
  return (
    <Stack direction="horizontal" align="center" gap="sm" className={userItemStyles({ className })}>
      <div className="relative shrink-0">
        <Avatar src={avatarUrl} />
        {presence && (
          <PresenceBadge
            presence={presence}
            className="absolute -bottom-0.5 -right-0.5"
          />
        )}
      </div>

      <div className="flex-1 self-start">
        <Text variant="body-sm" as="p" className="font-bold">
          {username}
        </Text>
      </div>

      {children}
    </Stack>
  );
}
