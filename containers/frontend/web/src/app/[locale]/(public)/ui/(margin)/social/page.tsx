'use client';

import { useTranslations } from 'next-intl';
import {
  Avatar,
  UserItem,
  Stack,
  Text,
  Button,
  TooltipTrigger,
  Icon,
  InternalLink,
} from '@components';

/* Example 1: Standard Friend */
function UserDevExample() {
  return (
    <UserItem username="user_dev" subtitle="Online" avatarUrl="/avatars/avatar-4.png">
      <>
        <TooltipTrigger label="Play Game" placement="top">
          <Button w="auto" aria-label="Play Game" icon={<Icon name="gamepad" />} size="icon" />
        </TooltipTrigger>
        <TooltipTrigger label="Send Message" placement="top">
          <InternalLink
            w="auto"
            href="/ui"
            as="button"
            size="icon"
            aria-label="Send Message"
            icon={<Icon name="messages" />}
          />
        </TooltipTrigger>
      </>
    </UserItem>
  );
}

/* Example 2: Friend Request */
function UserRequestExample() {
  return (
    <UserItem username="user_42" subtitle="Friend Request Sent" avatarUrl="/avatars/avatar-2.png">
      <>
        <TooltipTrigger label="Reject Request" placement="top">
          <Button
            w="auto"
            size="icon"
            icon={<Icon name="close" />}
            aria-label="Reject Friend Request"
            className="text-red-500 border-red-500 hover:bg-red-500/10"
          />
        </TooltipTrigger>
        <TooltipTrigger label="Accept Request" placement="top">
          <Button
            w="auto"
            size="icon"
            icon={<Icon name="check" />}
            aria-label="Accept Friend Request"
            className="text-green-500 border-green-500"
          />
        </TooltipTrigger>
      </>
    </UserItem>
  );
}

/* Example 3: Search Result */
function UserSearchResultExample() {
  return (
    <UserItem username="user_designer" avatarUrl="/avatars/avatar-1.png">
      <TooltipTrigger label="Add Friend" placement="top">
        <Button w="auto" size="icon" icon={<Icon name="userAdd" />} aria-label="Add Friend" />
      </TooltipTrigger>
    </UserItem>
  );
}

export default function SocialTestPage() {
  const t = useTranslations('pages.ui.social');

  const avatarProps: Array<{
    size: 'sm' | 'md' | 'lg';
    src: string | null;
    label: string;
  }> = [
    { size: 'sm', src: '/avatars/avatar-1.png', label: t('avatarSizes.sm') },
    { size: 'md', src: '/avatars/avatar-2.png', label: t('avatarSizes.md') },
    { size: 'lg', src: '/avatars/avatar-3.png', label: t('avatarSizes.lg') },
    { size: 'md', src: null, label: t('avatarSizes.fallback') },
  ];

  return (
    <Stack gap="lg" className="max-w-md">
      <Stack gap="xs">
        <Text as="h1" variant="heading-md">
          {t('title')}
        </Text>
        <Text color="secondary">{t('description')}</Text>
      </Stack>

      {/* --- AVATAR SECTION --- */}
      <Stack>
        <Text variant="heading-sm">{t('avatarsTitle')}</Text>

        <Stack direction="horizontal" align="center">
          {avatarProps.map((props, index) => (
            <Stack align="center" justify="end" gap="xs" key={index}>
              <Avatar size={props.size} src={props.src} />
              <Text variant="caption">{props.label}</Text>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* --- USERITEM SECTION --- */}
      <Stack>
        <Text variant="heading-sm">{t('userItemsTitle')}</Text>

        <Stack gap="sm" className="rounded-xl border border-border-primary py-4 bg-bg-primary/50">
          <Text variant="caption" color="tertiary" className="mb-2 px-4">
            {t('socialListLabel')}
          </Text>

          <UserDevExample />

          <hr className="mx-4 border-border-primary" />

          <UserRequestExample />

          <hr className="mx-4 border-border-primary" />

          <UserSearchResultExample />
        </Stack>
      </Stack>
    </Stack>
  );
}
