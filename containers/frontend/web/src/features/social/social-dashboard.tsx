/* eslint-disable local/no-literal-ui-strings */
'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  ScrollArea,
  Stack,
  Text,
  UserItem,
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
import {
  formatRequestAge,
  mapFriendshipToListItem,
  mapFriendToListItem,
  mapSearchResultToListItem,
} from './social-variants/social-list-items';

const MINUTE_IN_MS = 60_000;

function useRelativeNow() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, MINUTE_IN_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}

function FriendsList({ error }: { error?: SocialErrorCode }) {
  const t = useTranslations('features.social.friends');
  const friends = useSocialStore((s) => s.friends);
  const onlineFriends = friends.filter((f) => f.presence !== 'offline');
  const offlineFriends = friends.filter((f) => f.presence === 'offline');
  const onlineItems = onlineFriends.map(mapFriendToListItem);
  const offlineItems = offlineFriends.map(mapFriendToListItem);

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['online']}>
      <DisclosureFull id="online" title={`${t('online')} (${onlineFriends.length})`}>
        {error ? <SocialError error={error} /> : <UsersList items={onlineItems} type="online" />}
      </DisclosureFull>

      <DisclosureFull id="offline" title={`${t('offline')} (${offlineFriends.length})`}>
        {error ? <SocialError error={error} /> : <UsersList items={offlineItems} type="offline" />}
      </DisclosureFull>
    </DisclosureGroup>
  );
}

function RequestsList() {
  const t = useTranslations('features.social.requests');
  const locale = useLocale();
  const now = useRelativeNow();
  const pendingReceived = useSocialStore((s) => s.pendingReceived);
  const pendingSent = useSocialStore((s) => s.pendingSent);
  const errors = useSocialStore((s) => s.errors);
  const nowLabel = t('now');
  const pendingReceivedItems = pendingReceived.map((request) =>
    mapFriendshipToListItem(
      request,
      now
        ? formatRequestAge({
            createdAt: request.createdAt,
            now,
            locale,
            nowLabel,
          })
        : undefined,
    ),
  );
  const pendingSentItems = pendingSent.map((request) =>
    mapFriendshipToListItem(
      request,
      now
        ? formatRequestAge({
            createdAt: request.createdAt,
            now,
            locale,
            nowLabel,
          })
        : undefined,
    ),
  );

  return (
    <DisclosureGroup allowsMultipleExpanded={true} defaultExpandedKeys={['received']}>
      <DisclosureFull id="received" title={`${t('received')} (${pendingReceived.length})`}>
        {errors.pendingReceived ? (
          <SocialError error={errors.pendingReceived} />
        ) : (
          <UsersList items={pendingReceivedItems} type="request" />
        )}
      </DisclosureFull>

      <DisclosureFull id="sent" title={`${t('sent')} (${pendingSent.length})`}>
        {errors.pendingSent ? (
          <SocialError error={errors.pendingSent} />
        ) : (
          <UsersList items={pendingSentItems} type="pending" />
        )}
      </DisclosureFull>
    </DisclosureGroup>
  );
}

function SearchResults() {
  const t = useTranslations('features.social.requests');
  const locale = useLocale();
  const now = useRelativeNow();
  const searchResults = useSocialStore((state) => state.searchResults);
  const pendingReceived = useSocialStore((state) => state.pendingReceived);
  const pendingSent = useSocialStore((state) => state.pendingSent);
  const nowLabel = t('now');
  const onlineItems = searchResults.online.map((result) => mapSearchResultToListItem(result));
  const offlineItems = searchResults.offline.map((result) => mapSearchResultToListItem(result));
  const requestItems = searchResults.requests.map((result) => {
    const request = pendingReceived.find((item) => item.userId === result.id);
    const subtitle =
      request && now
        ? formatRequestAge({
            createdAt: request.createdAt,
            now,
            locale,
            nowLabel,
          })
        : undefined;

    return mapSearchResultToListItem(result, subtitle);
  });
  const pendingItems = searchResults.pending.map((result) => {
    const request = pendingSent.find((item) => item.userId === result.id);
    const subtitle =
      request && now
        ? formatRequestAge({
            createdAt: request.createdAt,
            now,
            locale,
            nowLabel,
          })
        : undefined;

    return mapSearchResultToListItem(result, subtitle);
  });
  const noneItems = searchResults.none.map((result) => mapSearchResultToListItem(result));

  return (
    <Stack gap="none" className="w-full py-2 pb-4">
      <UsersList items={onlineItems} type="online" feedback={false} />
      <UsersList items={offlineItems} type="offline" feedback={false} />
      <UsersList items={requestItems} type="request" feedback={false} />
      <UsersList items={pendingItems} type="pending" feedback={false} />
      <UsersList items={noneItems} type="search" feedback={false} />
    </Stack>
  );
}

function GameInvitationsList() {
  const t = useTranslations('features.social');
  const pendingInvitationMessagesByFriendId = useSocialStore(
    (state) => state.pendingInvitationMessagesByFriendId,
  );

  const invitations = Object.values(pendingInvitationMessagesByFriendId)
    .flat()
    .filter((msg) => msg.type === 'game_invitation');

  if (invitations.length === 0) {
    return (
      <Stack align="center" justify="center" className="px-3 py-3 text-center">
        <Text variant="caption" color="tertiary">
          {t('emptyStates.gameInvitations')}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="none" className="w-full">
      {invitations.map((msg) => (
        <UserItem
          key={msg.id}
          username={msg.content.inviterUsername}
          subtitle={t('gameInvitationSubtitle', { roomId: msg.content.roomId })}
        />
      ))}
    </Stack>
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
        <ScrollArea>
          <Stack align="center" justify="center" className="px-3 py-3 text-center">
            <Text variant="caption" color="tertiary">
              {t('emptyStates.search')}
            </Text>
          </Stack>
        </ScrollArea>
      );
    }

    return (
      <ScrollArea>
        <SearchResults />
      </ScrollArea>
    );
  }

  const activeGameInvitationCount = useSocialStore((state) => state.activeGameInvitationCount);

  return (
    <Tabs defaultSelectedKey="friends" className="flex flex-1 min-h-0 flex-col">
      <TabList className="px-3">
        <Tab id="friends">{t('friends.title')}</Tab>
        <Tab id="requests">{t('requests.title')}</Tab>
        <Tab id="invitations">
          {t('gameInvitations')}
          {activeGameInvitationCount > 0 && ` (${activeGameInvitationCount})`}
        </Tab>
      </TabList>

      <ScrollArea>
        <TabPanel id="friends" className="outline-none">
          <FriendsList error={errors.friends} />
        </TabPanel>

        <TabPanel id="requests" className="outline-none">
          <RequestsList />
        </TabPanel>

        <TabPanel id="invitations" className="outline-none">
          <GameInvitationsList />
        </TabPanel>
      </ScrollArea>
    </Tabs>
  );
}

export function SocialDashboard() {
  return (
    <Stack className="h-full min-h-0 pointer-events-auto" gap="none">
      <SocialHeader />
      <main className="flex flex-1 min-h-0">
        <SocialContent />
      </main>
    </Stack>
  );
}
