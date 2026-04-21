'use client';

import { useTranslations } from 'next-intl';

import {
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DisclosureGroup,
  DisclosureFull,
  UserItem,
  Icon,
  TooltipTrigger,
  Button,
  type UserItemProps,
  TextField,
  IconName,
} from '@/components';

function ButtonWithTooltip({
  label,
  placement = 'top',
  onPress,
  icon,
  className,
}: {
  label: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onPress?: () => void;
  icon: IconName;
  className?: string;
}) {
  return (
    <TooltipTrigger label={label} placement={placement}>
      <Button
        w="auto"
        size="icon"
        variant="secondary"
        icon={<Icon name={icon} />}
        aria-label={label}
        className={className}
        onPress={onPress}
      />
    </TooltipTrigger>
  );
}

function UserListRequestActions({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <>
      <ButtonWithTooltip
        label={tActions('reject')}
        icon="close"
        className="text-red-500 border-red-500"
        onPress={() => console.log(username)}
      />
      <ButtonWithTooltip
        label={tActions('accept')}
        icon="check"
        className="text-green-500 border-green-500"
        onPress={() => console.log(username)}
      />
    </>
  );
}

function UserListPendingActions({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <ButtonWithTooltip
      label={tActions('reject')}
      icon="close"
      className="text-red-500 border-red-500"
      onPress={() => console.log(username)}
    />
  );
}

function UserOnlineActions({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <>
      <ButtonWithTooltip
        label={tActions('chat')}
        icon="messages"
        onPress={() => console.log(username)}
      />
      <ButtonWithTooltip
        label={tActions('inviteToGame')}
        icon="gamepad"
        onPress={() => console.log(username)}
      />
    </>
  );
}

function UserOfflineActions({ username }: { username: string }) {
  const tActions = useTranslations('features.social.actions');
  return (
    <ButtonWithTooltip
      label={tActions('chat')}
      icon="messages"
      onPress={() => console.log(username)}
    />
  );
}

function UsersList({
  friends,
  type,
}: {
  friends: UserItemProps[];
  type: 'request' | 'pending' | 'online' | 'offline';
}) {
  return friends.map(({ username, subtitle, avatarUrl, className }) => (
    <UserItem
      username={username}
      subtitle={subtitle}
      avatarUrl={avatarUrl}
      className={className}
      key={username}
    >
      {type === 'request' && <UserListRequestActions username={username} />}
      {type === 'pending' && <UserListPendingActions username={username} />}
      {type === 'online' && <UserOnlineActions username={username} />}
      {type === 'offline' && <UserOfflineActions username={username} />}
    </UserItem>
  ));
}

function FriendsList() {
  const t = useTranslations('features.social.friends');
  const onlineFriends = [
    { id: 1, username: 'capapes', avatarUrl: '/avatars/avatar-1.png', subtitle: t('online') },
    { id: 2, username: 'mfontser', avatarUrl: '/avatars/avatar-2.png', subtitle: t('online') },
  ];

  const offlineFriends = [
    { id: 3, username: 'joanavar', avatarUrl: '/avatars/avatar-3.png', subtitle: t('offline') },
  ];

  return (
    <>
      <DisclosureFull id="online" title={`${t('online')} (${onlineFriends.length})`}>
        <UsersList friends={onlineFriends} type="online" />
      </DisclosureFull>

      <DisclosureFull id="offline" title={`${t('offline')} (${offlineFriends.length})`}>
        <UsersList friends={offlineFriends} type="offline" />
      </DisclosureFull>
    </>
  );
}

function RequestsList() {
  const t = useTranslations('features.social.requests');

  const requests = [
    {
      id: 1,
      username: 'cmanica-',
      avatarUrl: '/avatars/avatar-4.png',
      subtitle: 'sentSubtitle',
    },
  ];

  return (
    <DisclosureGroup selectionMode="single" defaultExpandedKeys={['received']}>
      <DisclosureFull id="received" title={`${t('received')} (${requests.length})`}>
        <UsersList friends={requests} type="request" />
      </DisclosureFull>

      <DisclosureFull id="sent" title={`${t('sent')} (0)`}>
        <Text variant="caption" color="tertiary" className="text-center py-6 px-3">
          {t('noSentRequests')}
        </Text>
      </DisclosureFull>
    </DisclosureGroup>
  );
}

export function SocialDashboard() {
  const t = useTranslations('features.social');

  return (
    <aside className="flex h-full w-full flex-col bg-bg-primary/50 backdrop-blur-sm border-l border-border-primary overflow-hidden">
      <Stack gap="md" className="p-3">
        <Text as="h1" variant="heading-md" className="font-bold">
          {t('title')}
        </Text>
        <TextField labelKey={t('searchLabel')} />
      </Stack>
      <main className="pt-3">
        <Tabs defaultSelectedKey="friends">
          <TabList className="px-3">
            <Tab id="friends">{t('friends.title')}</Tab>
            <Tab id="requests">{t('requests.title')}</Tab>
          </TabList>

          <TabPanel id="friends" className="outline-none">
            <FriendsList />
          </TabPanel>

          <TabPanel id="requests" className="outline-none">
            <RequestsList />
          </TabPanel>
        </Tabs>
      </main>
    </aside>
  );
}
