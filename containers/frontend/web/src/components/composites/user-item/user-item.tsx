import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
import { userItemStyles } from './user-item.styles';
import { InternalLink } from '../../controls/link';

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
      <Avatar src={avatarUrl} />

      <div className="flex-1 self-start">
        <InternalLink
          href={`/other/${username}`}
          className="no-underline !text-inherit font-body-sm font-bold"
        >
          {username}
        </InternalLink>
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
