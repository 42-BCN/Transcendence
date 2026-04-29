import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
import { userItemStyles } from './user-item.styles';
import { InternalLink } from '../../controls/link';

export type UserItemProps = {
  id: string;
  avatarUrl?: string | null;
  username: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function UserItem({
  id,
  avatarUrl,
  username,
  subtitle,
  children,
  className,
}: UserItemProps) {
  return (
    <Stack direction="horizontal" align="center" gap="sm" className={userItemStyles({ className })}>
      <Avatar src={avatarUrl} />

      <div className="flex-1 self-start">
        <InternalLink href={`/other/${username}`} className="no-underline !text-inherit">
          <Text variant="body-sm" className="font-bold">
            {username}
          </Text>
        </InternalLink>
      </div>

      {children}
    </Stack>
  );
}
