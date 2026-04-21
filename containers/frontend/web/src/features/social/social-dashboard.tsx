'use client';

import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import {
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Disclosure,
  DisclosureGroup,
  DisclosureTrigger,
  DisclosurePanel,
  UserItem,
  Icon,
  Input,
  TooltipTrigger,
  Button,
  InternalLink,
} from '@/components';

interface FriendItemProps {
  username: string;
  avatarUrl: string;
  subtitle: string;
  showGameAction?: boolean;
  className?: string;
}

function FriendItem({
  username,
  avatarUrl,
  subtitle,
  showGameAction = true,
  className,
}: FriendItemProps) {
  const tActions = useTranslations('features.social.actions');

  return (
    <UserItem
      username={username}
      subtitle={subtitle}
      avatarUrl={avatarUrl}
      className={className}
      actions={
        <Stack direction="horizontal" gap="xs">
          {showGameAction && (
            <TooltipTrigger label={tActions('inviteToGame')} placement="top">
              <Button
                w="auto"
                size="icon"
                variant="secondary"
                aria-label={tActions('inviteToGame')}
                icon={<Icon name="gamepad" />}
              />
            </TooltipTrigger>
          )}
          <TooltipTrigger label={tActions('chat')} placement="top">
            <InternalLink
              w="auto"
              href="/ui"
              as="button"
              size="icon"
              variant="secondary"
              aria-label={tActions('chat')}
              icon={<Icon name="messages" />}
            />
          </TooltipTrigger>
        </Stack>
      }
    />
  );
}

interface RequestItemProps {
  username: string;
  avatarUrl: string;
  subtitle: string;
  className?: string;
}

function RequestItem({ username, avatarUrl, subtitle, className }: RequestItemProps) {
  const tActions = useTranslations('features.social.actions');

  return (
    <UserItem
      username={username}
      subtitle={subtitle}
      avatarUrl={avatarUrl}
      className={className}
      actions={
        <Stack direction="horizontal" gap="xs">
          <TooltipTrigger label={tActions('reject')} placement="top">
            <Button
              w="auto"
              size="icon"
              variant="secondary"
              icon={<Icon name="close" />}
              aria-label={tActions('reject')}
              className="text-red-500 border-red-500"
            />
          </TooltipTrigger>
          <TooltipTrigger label={tActions('accept')} placement="top">
            <Button
              w="auto"
              size="icon"
              variant="secondary"
              icon={<Icon name="check" />}
              aria-label={tActions('accept')}
              className="text-green-500 border-green-500"
            />
          </TooltipTrigger>
        </Stack>
      }
    />
  );
}

function FriendsList() {
  const t = useTranslations('features.social.friends');

  const onlineFriends = [
    { id: 1, username: 'capapes', avatarUrl: '/avatars/avatar-1.png' },
    { id: 2, username: 'mfontser', avatarUrl: '/avatars/avatar-2.png' },
  ];

  const offlineFriends = [{ id: 3, username: 'joanavar', avatarUrl: '/avatars/avatar-3.png' }];

  return (
    <Stack>
      <Disclosure defaultExpanded>
        <DisclosureTrigger title={`${t('online')} (${onlineFriends.length})`} />
        <DisclosurePanel>
          <Stack gap="sm" className="py-1">
            {onlineFriends.map((friend, index) => (
              <Fragment key={friend.id}>
                <FriendItem
                  username={friend.username}
                  avatarUrl={friend.avatarUrl}
                  subtitle={t('online')}
                  className="px-0"
                />
                {index < onlineFriends.length - 1 && (
                  <hr className="w-full border-border-primary" />
                )}
              </Fragment>
            ))}
          </Stack>
        </DisclosurePanel>
      </Disclosure>

      <Disclosure>
        <DisclosureTrigger title={`${t('offline')} (${offlineFriends.length})`} />
        <DisclosurePanel>
          <Stack gap="sm" className="py-1">
            {offlineFriends.map((friend, index) => (
              <Fragment key={friend.id}>
                <FriendItem
                  username={friend.username}
                  avatarUrl={friend.avatarUrl}
                  subtitle={t('offline')}
                  showGameAction={false}
                  className="px-0"
                />
                {index < offlineFriends.length - 1 && (
                  <hr className="w-full border-border-primary" />
                )}
              </Fragment>
            ))}
          </Stack>
        </DisclosurePanel>
      </Disclosure>
    </Stack>
  );
}

function RequestsList() {
  const t = useTranslations('features.social.requests');

  const requests = [
    {
      id: 1,
      username: 'cmanica-',
      avatarUrl: '/avatars/avatar-4.png',
      subtitleKey: 'sentSubtitle',
    },
  ];

  return (
    <DisclosureGroup selectionMode="single" defaultExpandedKeys={['received']}>
      <Stack>
        <Disclosure id="received">
          <DisclosureTrigger title={`${t('received')} (${requests.length})`} />
          <DisclosurePanel>
            <Stack gap="sm" className="py-1">
              {requests.map((req, index) => (
                <Fragment key={req.id}>
                  <RequestItem
                    username={req.username}
                    avatarUrl={req.avatarUrl}
                    subtitle={t(req.subtitleKey)}
                    className="px-0"
                  />
                  {index < requests.length - 1 && <hr className="w-full border-border-primary" />}
                </Fragment>
              ))}
            </Stack>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="sent">
          <DisclosureTrigger title={`${t('sent')} (0)`} />
          <DisclosurePanel>
            <Text variant="caption" color="tertiary" className="text-center">
              {t('noSentRequests')}
            </Text>
          </DisclosurePanel>
        </Disclosure>
      </Stack>
    </DisclosureGroup>
  );
}

export function SocialDashboard() {
  const t = useTranslations('features.social');

  return (
    <aside className="flex h-full w-full flex-col bg-bg-primary/50 backdrop-blur-sm border-l border-border-primary overflow-hidden">
      <Tabs defaultSelectedKey="friends" className="flex flex-col h-full">
        <header className="px-6 pt-4 border-b border-border-primary">
          <Stack gap="md">
            <Text as="h1" variant="heading-md" className="font-bold">
              {t('title')}
            </Text>

            <Stack gap="xs">
              <Text variant="caption" color="secondary" className="font-medium">
                {t('searchLabel')}
              </Text>
              <Input />
            </Stack>

            <TabList>
              <Tab id="friends">{t('friends.title')}</Tab>
              <Tab id="requests">{t('requests.title')}</Tab>
            </TabList>
          </Stack>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-2">
          <TabPanel id="friends" className="outline-none">
            <FriendsList />
          </TabPanel>

          <TabPanel id="requests" className="outline-none">
            <RequestsList />
          </TabPanel>
        </main>
      </Tabs>
    </aside>
  );
}
