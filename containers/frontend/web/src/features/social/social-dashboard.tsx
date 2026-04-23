'use client';

import { useEffect } from 'react';
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
} from '@/components';

import { UsersList } from './social-variants';
import { useSocialData } from './hooks/use-social-data';

function FriendsList() {
  const t = useTranslations('features.social.friends');
  const { friends, isLoading } = useSocialData();
  console.log(friends);
  const onlineFriends = friends?.filter((f) => f.isOnline);
  const offlineFriends = friends?.filter((f) => !f.isOnline);

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['online']}>
      <DisclosureFull
        id="online"
        title={`${t('online')} (${isLoading ? '...' : onlineFriends?.length})`}
      >
        <UsersList friends={onlineFriends} type="online" />
      </DisclosureFull>

      <DisclosureFull
        id="offline"
        title={`${t('offline')} (${isLoading ? '...' : offlineFriends?.length})`}
      >
        <UsersList friends={offlineFriends} type="offline" />
      </DisclosureFull>
    </DisclosureGroup>
  );
}

function RequestsList() {
  const t = useTranslations('features.social.requests');
  const { pendingReceived, pendingSent, isLoading } = useSocialData();

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['received']}>
      <DisclosureFull
        id="received"
        title={`${t('received')} (${isLoading ? '...' : pendingReceived?.length})`}
      >
        <UsersList friends={pendingReceived} type="request" />
      </DisclosureFull>

      <DisclosureFull id="sent" title={`${t('sent')} (${isLoading ? '...' : pendingSent?.length})`}>
        <UsersList friends={pendingSent} type="pending" />
      </DisclosureFull>
    </DisclosureGroup>
  );
}

export function SocialDashboard() {
  const t = useTranslations('features.social');
  const { refreshAll } = useSocialData();

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <>
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
    </>
  );
}
