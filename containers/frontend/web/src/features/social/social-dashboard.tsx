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

import { UserSearch, UsersList } from './social-variants';
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
        <UsersList friends={onlineFriends} type="online" error={error} />
      </DisclosureFull>

      <DisclosureFull id="offline" title={`${t('offline')} (${offlineFriends.length})`}>
        <UsersList friends={offlineFriends} type="offline" error={error} />
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
        <UsersList friends={pendingReceived} type="request" error={errors.pendingReceived} />
      </DisclosureFull>

      <DisclosureFull id="sent" title={`${t('sent')} (${pendingSent.length})`}>
        <UsersList friends={pendingSent} type="pending" error={errors.pendingSent} />
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
      </main>
    </>
  );
}
