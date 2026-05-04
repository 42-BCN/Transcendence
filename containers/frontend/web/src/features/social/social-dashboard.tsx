/* eslint-disable local/no-literal-ui-strings */
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
} from '@/components';

import { UserSearch, UsersList, SocialError } from './social-variants';
import type { SocialErrorCode } from './store/social-store.types';
import { useSocialStore } from '@/providers/social-provider';
import { SearchResults } from './social-variants/users-list';
import { SocialSocketBridge } from './store/social-store.bridge';

function FriendsList({ error }: { error?: SocialErrorCode }) {
  const t = useTranslations('features.social.friends');
  const friends = useSocialStore((s) => s.friends);
  const onlineFriends = friends.filter((f) => f.presence !== 'offline');
  const offlineFriends = friends.filter((f) => f.presence === 'offline');

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

function RequestsList() {
  const t = useTranslations('features.social.requests');
  const pendingReceived = useSocialStore((s) => s.pendingReceived);
  const pendingSent = useSocialStore((s) => s.pendingSent);
  const errors = useSocialStore((s) => s.errors);

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

function SocialHeader() {
  const t = useTranslations('features.social');
  return (
    <Stack gap="md" className="p-3">
      <Text as="h1" variant="heading-md" className="font-bold">
        {t('title')}
      </Text>
      <UserSearch />
    </Stack>
  );
}

function SocialContent() {
  const t = useTranslations('features.social');
  const searchQuery = useSocialStore((state) => state.searchQuery);
  const searchResults = useSocialStore((state) => state.searchResults);
  const errors = useSocialStore((state) => state.errors);

  if (searchQuery.trim() !== '') {
    const isEmpty =
      searchResults.online.length === 0 &&
      searchResults.offline.length === 0 &&
      searchResults.requests.length === 0 &&
      searchResults.pending.length === 0 &&
      searchResults.none.length === 0;

    if (isEmpty) {
      return (
        <Stack align="center" justify="center" className="px-3 py-3 text-center">
          <Text variant="caption" color="tertiary">
            {t('emptyStates.search')}
          </Text>
        </Stack>
      );
    }

    return <SearchResults />;
  }

  return (
    <Tabs defaultSelectedKey="friends">
      <TabList className="px-3">
        <Tab id="friends">{t('friends.title')}</Tab>
        <Tab id="requests">{t('requests.title')}</Tab>
      </TabList>

      <TabPanel id="friends" className="outline-none">
        <FriendsList error={errors.friends} />
      </TabPanel>

      <TabPanel id="requests" className="outline-none">
        <RequestsList />
      </TabPanel>
    </Tabs>
  );
}

export function SocialDashboard() {
  return (
    <>
      <SocialSocketBridge />
      <SocialHeader />
      <main>
        <SocialContent />
      </main>
    </>
  );
}
