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
import type { SocialErrorCode, SocialInitialData } from './store/social-store.types';
import { SocialStoreProvider, useSocialStore } from './store/social-store.provider';
import { SearchResults } from './social-variants/users-list';

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

function SocialContent({ errors }: { errors: SocialInitialData['errors'] }) {
  const t = useTranslations('features.social');
  const searchQuery = useSocialStore((state) => state.searchQuery);
  const searchResults = useSocialStore((state) => state.searchResults);

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
        <RequestsList
          errors={{
            pendingReceived: errors.pendingReceived,
            pendingSent: errors.pendingSent,
          }}
        />
      </TabPanel>
    </Tabs>
  );
}

export function SocialDashboard({ initialData }: { initialData: SocialInitialData }) {
  return (
    <SocialStoreProvider initialData={initialData}>
      <SocialHeader />
      <main>
        <SocialContent errors={initialData.errors} />
      </main>
    </SocialStoreProvider>
  );
}
