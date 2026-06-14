import type { ReactNode } from 'react';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Avatar } from '@components/primitives/avatar';
import { cn } from '@/lib/styles/cn';
import { userItemStyles } from './user-item.styles';
import { InternalLink } from '../../controls/link';
import type { InternalLinkProps } from '../../controls/link';

export type UserItemProps = {
  avatarUrl?: string | null;
  username: string;
  subtitle?: string;
  subtitleClassName?: string;
  children?: ReactNode;
  className?: string;
  href?: InternalLinkProps['href'];
};

export function UserItem({
  avatarUrl,
  username,
  subtitle,
  subtitleClassName,
  children,
  className,
  href,
}: UserItemProps) {
  const stack = (
    <Stack direction="horizontal" align="center" gap="sm" className={userItemStyles({ className })}>
      <Avatar src={avatarUrl} />

      <div className="flex-1 self-start">
        {href ? (
          <span className="!text-inherit font-body-sm font-bold">{username}</span>
        ) : (
          <InternalLink
            href={{ pathname: '/other/[username]', params: { username } }}
            className="no-underline !text-inherit font-body-sm font-bold"
          >
            {username}
          </InternalLink>
        )}
        {subtitle && (
          <Text variant="caption" as="p" color="tertiary" className={cn(subtitleClassName)}>
            {subtitle}
          </Text>
        )}
      </div>

      {children}
    </Stack>
  );

  return href ? (
    <InternalLink href={href} className={className}>
      {stack}
    </InternalLink>
  ) : (
    stack
  );
}
