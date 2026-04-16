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

export default function SocialTestPage() {
  const t = useTranslations('pages.ui.social');

  return (
    <Stack gap="lg" className="max-w-md">
      <Stack gap="xs">
        <Text as="h1" variant="heading-md">
          {t('title')}
        </Text>
        <Text color="secondary">{t('description')}</Text>
      </Stack>

      {/* --- AVATAR SECTION --- */}
      <Stack gap="md">
        <Text variant="heading-sm">{t('avatarsTitle')}</Text>
        <Stack direction="horizontal" align="center" gap="md">
          <Stack align="center" gap="xs">
            <Avatar size="sm" src="/avatars/avatar-1.png" />
            <Text variant="caption">{t('avatarSizes.sm')}</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="md" src="/avatars/avatar-2.png" />
            <Text variant="caption">{t('avatarSizes.md')}</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="lg" src="/avatars/avatar-3.png" />
            <Text variant="caption">{t('avatarSizes.lg')}</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="md" src={null} />
            <Text variant="caption">{t('avatarSizes.fallback')}</Text>
          </Stack>
        </Stack>
      </Stack>

      {/* --- USERITEM SECTION --- */}
      <Stack gap="md">
        <Text variant="heading-sm">{t('userItemsTitle')}</Text>

        <Stack gap="sm" className="rounded-xl border border-border-primary p-4 bg-bg-primary/50">
          <Text variant="caption" color="tertiary" className="mb-2">
            {t('socialListLabel')}
          </Text>

          {/* Example 1: Standard Friend */}
          <UserItem
            username="user_dev"
            subtitle={t('status.online')}
            avatarUrl="/avatars/avatar-4.png"
            actions={
              <>
                <TooltipTrigger label={t('actions.playGame')} placement="top">
                  <Button variant="primary" size="lg" className="aspect-square p-0">
                    <Icon name="gamepad" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipTrigger label={t('actions.sendMessage')} placement="top">
                  <InternalLink
                    href="/ui"
                    as="button"
                    variant="primary"
                    size="lg"
                    className="aspect-square p-0"
                  >
                    <Icon name="messages" className="h-4 w-4" />
                  </InternalLink>
                </TooltipTrigger>
              </>
            }
          />

          <div className="h-px bg-border-primary w-full" />

          {/* Example 2: Friend Request */}
          <UserItem
            username="user_42"
            subtitle={t('status.sent')}
            avatarUrl="/avatars/avatar-2.png"
            actions={
              <>
                <TooltipTrigger label={t('actions.acceptRequest')} placement="top">
                  <Button variant="primary" size="lg" className="aspect-square p-0">
                    <Icon name="check" className="h-4 w-4 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipTrigger label={t('actions.rejectRequest')} placement="top">
                  <Button variant="secondary" size="lg" className="aspect-square p-0">
                    <Icon name="close" className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
              </>
            }
          />

          <div className="h-px bg-border-primary w-full" />

          {/* Example 3: Search Result */}
          <UserItem
            username="user_designer"
            avatarUrl="/avatars/avatar-1.png"
            actions={
              <TooltipTrigger label={t('actions.addFriend')} placement="top">
                <Button variant="primary" size="lg" className="aspect-square p-0">
                  <Icon name="userAdd" className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
