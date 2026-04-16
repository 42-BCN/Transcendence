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

        <Stack gap="sm" className="rounded-xl border border-border-primary py-4 bg-bg-primary/50">
          <Text variant="caption" color="tertiary" className="mb-2 px-4">
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
                  <Button
                    size="icon"
                    icon={<Icon name="gamepad" />}
                    aria-label={t('actions.playGame')}
                  />
                </TooltipTrigger>
                <TooltipTrigger label={t('actions.sendMessage')} placement="top">
                  <InternalLink
                    href="/ui"
                    as="button"
                    size="icon"
                    icon={<Icon name="messages" />}
                    aria-label={t('actions.sendMessage')}
                  />
                </TooltipTrigger>
              </>
            }
          />

          <div className="mx-4 h-px bg-border-primary" />

          {/* Example 2: Friend Request */}
          <UserItem
            username="user_42"
            subtitle={t('status.sent')}
            avatarUrl="/avatars/avatar-2.png"
            actions={
              <>
                <TooltipTrigger label={t('actions.rejectRequest')} placement="top">
                  <Button
                    variant="secondary"
                    size="icon"
                    icon={<Icon name="close" className="text-red-500" />}
                    aria-label={t('actions.rejectRequest')}
                  />
                </TooltipTrigger>
                <TooltipTrigger label={t('actions.acceptRequest')} placement="top">
                  <Button
                    size="icon"
                    icon={<Icon name="check" className="text-green-500" />}
                    aria-label={t('actions.acceptRequest')}
                  />
                </TooltipTrigger>
              </>
            }
          />

          <div className="mx-4 h-px bg-border-primary" />

          {/* Example 3: Search Result */}
          <UserItem
            username="user_designer"
            avatarUrl="/avatars/avatar-1.png"
            actions={
              <TooltipTrigger label={t('actions.addFriend')} placement="top">
                <Button
                  size="icon"
                  icon={<Icon name="userAdd" />}
                  aria-label={t('actions.addFriend')}
                />
              </TooltipTrigger>
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
