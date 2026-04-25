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
} from '@/components';

import { UserSearch, UsersList, SocialError, SearchResults } from './social-variants';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import { useSocialStore } from './store/use-social-store';
import type { FriendshipsErrorName } from '@/contracts/api/friendships/friendships.errors';

export type SocialErrorCode = FriendshipsErrorName | 'FETCH_FAILED';

export interface SocialInitialData {
  friends: FriendPublic[];
  pendingReceived: FriendshipPublic[];
  pendingSent: FriendshipPublic[];
  errors: {
    friends?: SocialErrorCode;
    pendingReceived?: SocialErrorCode;
    pendingSent?: SocialErrorCode;
  };
}

function FriendsList({ error }: { error?: SocialErrorCode }) {
  const t = useTranslations('features.social.friends');
  const friends = useSocialStore((s) => s.friends);
  const onlineFriends = friends.filter((f) => f.isOnline);
  const offlineFriends = friends.filter((f) => !f.isOnline);

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['online']}>
      <DisclosureFull id="online" title={`${t('online')} (${onlineFriends.length})`}>
        {error ? (
          <SocialError error={error} />
        ) : (
          <UsersList friends={onlineFriends} type="online" />
        )}
      </DisclosureFull>

      <DisclosureFull id="offline" title={`${t('offline')} (${offlineFriends.length})`}>
        {error ? (
          <SocialError error={error} />
        ) : (
          <UsersList friends={offlineFriends} type="offline" />
        )}
      </DisclosureFull>
    </DisclosureGroup>
  );
}

function RequestsList({ errors }: { errors: SocialInitialData['errors'] }) {
  const t = useTranslations('features.social.requests');
  const pendingReceived = useSocialStore((s) => s.pendingReceived);
  const pendingSent = useSocialStore((s) => s.pendingSent);

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['received']}>
      <DisclosureFull id="received" title={`${t('received')} (${pendingReceived.length})`}>
        {errors.pendingReceived ? (
          <SocialError error={errors.pendingReceived} />
        ) : (
          <UsersList friends={pendingReceived} type="request" />
        )}
      </DisclosureFull>

      <DisclosureFull id="sent" title={`${t('sent')} (${pendingSent.length})`}>
        {errors.pendingSent ? (
          <SocialError error={errors.pendingSent} />
        ) : (
          <UsersList friends={pendingSent} type="pending" />
        )}
      </DisclosureFull>
    </DisclosureGroup>
  );
}

export function SocialDashboard({ initialData }: { initialData: SocialInitialData }) {
  const t = useTranslations('features.social');

  const setFriends = useSocialStore((s) => s.setFriends);
  const setPendingReceived = useSocialStore((s) => s.setPendingReceived);
  const setPendingSent = useSocialStore((s) => s.setPendingSent);

  useEffect(() => {
    setFriends(initialData.friends);
    setPendingReceived(initialData.pendingReceived);
    setPendingSent(initialData.pendingSent);
  }, [initialData, setFriends, setPendingReceived, setPendingSent]);

  return (
    <>
      <Stack gap="md" className="p-3">
        <Text as="h1" variant="heading-md" className="font-bold">
          {t('title')}
        </Text>
        <UserSearch />
      </Stack>
      <main>
        {useSocialStore((state) => state.searchQuery).trim() !== '' ? (
          <UsersList friends={useSocialStore((state) => state.searchResults)} type="search" />
        ) : (
          <Tabs defaultSelectedKey="friends">
            <TabList className="px-3">
              <Tab id="friends">{t('friends.title')}</Tab>
              <Tab id="requests">{t('requests.title')}</Tab>
            </TabList>

            <TabPanel id="friends" className="outline-none">
              <FriendsList error={initialData.errors.friends} />
            </TabPanel>

            <TabPanel id="requests" className="outline-none">
              <RequestsList errors={initialData.errors} />
            </TabPanel>
          </Tabs>
        )}
      </main>
    </>
  );
}
