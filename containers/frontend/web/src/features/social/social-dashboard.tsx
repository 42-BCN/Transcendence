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
  TextField,
  glassCardStyles,
} from '@/components';

import { UsersList } from './social-variants';

function FriendsList() {
  const t = useTranslations('features.social.friends');
  const onlineFriends = [
    { id: 1, username: 'capapes', avatarUrl: '/avatars/avatar-1.png' /*, subtitle: t('online') */ },
    {
      id: 2,
      username: 'mfontser',
      avatarUrl: '/avatars/avatar-2.png' /*, subtitle: t('online') */,
    },
  ];

  const offlineFriends = [
    {
      id: 3,
      username: 'joanavar',
      avatarUrl: '/avatars/avatar-3.png' /*, subtitle: t('offline') */,
    },
  ];

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['online']}>
      <DisclosureFull id="online" title={`${t('online')} (${onlineFriends.length})`}>
        <UsersList friends={onlineFriends} type="online" />
      </DisclosureFull>

      <DisclosureFull id="offline" title={`${t('offline')} (${offlineFriends.length})`}>
        <UsersList friends={offlineFriends} type="offline" />
      </DisclosureFull>
    </DisclosureGroup>
  );
}

function RequestsList() {
  const t = useTranslations('features.social.requests');

  const requests = [
    {
      id: 1,
      username: 'cmanica-',
      avatarUrl: '/avatars/avatar-4.png',
      // subtitle: 'sentSubtitle',
    },
  ];

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['received']}>
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
    <aside
      className={glassCardStyles({
        intensity: 'medium',
        blur: 'sm',
        className: 'h-full w-full overflow-hidden rounded-l-md rounded-r-none border-r-0 p-0',
      })}
    >
      <Stack gap="md" className="p-3">
        <Text as="h1" variant="heading-md" className="font-bold">
          {t('title')}
        </Text>
        <TextField labelKey="features.social.searchLabel" />
      </Stack>
      <main>
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
