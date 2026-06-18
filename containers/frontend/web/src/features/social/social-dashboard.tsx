/* eslint-disable local/no-literal-ui-strings */
'use client';

import { useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Stack,
  Text,
  UserItem,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DisclosureGroup,
  DisclosureFull,
  Button,
} from '@/components';
import { cn } from '@/lib/styles/cn';

import { UserSearch, UsersList, SocialError } from './social-variants';
import type { SocialErrorCode } from './store/social-store.types';
import { useSocialStore } from '@/providers/social-provider';
import {
  acceptGameInvitation,
  declineGameInvitation,
  fetchGameInvitationState,
} from '@/features/game-invitations/game-invitations.client';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import {
  formatRequestAge,
  mapFriendshipToListItem,
  mapFriendToListItem,
  mapSearchResultToListItem,
} from './social-variants/social-list-items';
import {
  useGameInvitationsStore,
  GameInvitationsStoreContext,
} from '@/features/game-invitations/store/game-invitations.provider';
import { selectActiveInvitationCount } from '@/features/game-invitations/store/game-invitations.selectors';
import type { GameInvitationView } from '@/features/game-invitations/store/game-invitations.types';

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

function GameInvitationActions({ invitation }: { invitation: GameInvitationView }) {
  const t = useTranslations('features.social.actions');
  const roomsStore = useContext(RoomsStoreContext);
  const gameInvitationsStore = useContext(GameInvitationsStoreContext);
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(() => {
      void acceptGameInvitation(invitation.id).then((response) => {
        if (response.ok) {
          roomsStore?.setRoomState(response.data.room);
        }
        void fetchGameInvitationState().then((stateResponse) => {
          if (stateResponse.ok) {
            gameInvitationsStore?.getState().setInvitationState(stateResponse.data);
          }
        });
      });
    });
  };

  const handleDecline = () => {
    startTransition(() => {
      void declineGameInvitation(invitation.id).then(() => {
        void fetchGameInvitationState().then((stateResponse) => {
          if (stateResponse.ok) {
            gameInvitationsStore?.getState().setInvitationState(stateResponse.data);
          }
        });
      });
    });
  };

  return (
    <Stack direction="horizontal" gap="xs">
      <Button variant="secondary" size="sm" w="auto" onPress={handleDecline} isDisabled={isPending}>
        {t('decline')}
      </Button>
      <Button variant="primary" size="sm" w="auto" onPress={handleAccept} isDisabled={isPending}>
        {t('accept')}
      </Button>
    </Stack>
  );
}

function GameInvitationsList() {
  const t = useTranslations('features.social');
  const allInvitations = useGameInvitationsStore((s) => s.invitationsById);
  const received = useMemo(
    () =>
      Object.values(allInvitations).filter(
        (inv) => inv.direction === 'received' && inv.status === 'pending',
      ),
    [allInvitations],
  );

  const sent = useMemo(
    () =>
      Object.values(allInvitations).filter(
        (inv) => inv.direction === 'sent' && inv.status === 'pending',
      ),
    [allInvitations],
  );

  if (received.length === 0 && sent.length === 0) {
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
      {received.map((inv) => (
        <UserItem
          key={inv.id}
          username={inv.inviterUsername}
          subtitle={t('gameInvitationSubtitle', { roomId: String(inv.roomId) })}
        >
          <GameInvitationActions invitation={inv} />
        </UserItem>
      ))}
      {sent.map((inv) => (
        <Stack key={inv.id} gap="none">
          <UserItem username={inv.friendUsername} subtitle={t('gameInvitationSentSubtitle')} />
        </Stack>
      ))}
    </Stack>
  );
}

function SocialScrollContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'w-full min-w-0',
        'lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:touch-pan-y',
        className,
      )}
    >
      {children}
    </div>
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
  const activeGameInvitationCount = useGameInvitationsStore(selectActiveInvitationCount);

  if (searchQuery.trim() !== '') {
    const isEmpty =
      searchResults.online.length === 0 &&
      searchResults.offline.length === 0 &&
      searchResults.requests.length === 0 &&
      searchResults.pending.length === 0 &&
      searchResults.none.length === 0;

    if (isEmpty) {
      return (
        <SocialScrollContainer>
          <Stack align="center" justify="center" className="px-3 py-3 text-center">
            <Text variant="caption" color="tertiary">
              {t('emptyStates.search')}
            </Text>
          </Stack>
        </SocialScrollContainer>
      );
    }

    return (
      <SocialScrollContainer>
        <SearchResults />
      </SocialScrollContainer>
    );
  }

  return (
    <Tabs defaultSelectedKey="friends" className="flex w-full flex-col lg:flex-1 lg:min-h-0">
      <TabList className="px-3">
        <Tab id="friends">{t('friends.title')}</Tab>
        <Tab id="requests">{t('requests.title')}</Tab>
        <Tab id="invitations">
          {t('gameInvitations')}
          {activeGameInvitationCount > 0 && ` (${activeGameInvitationCount})`}
        </Tab>
      </TabList>

      <SocialScrollContainer>
        <TabPanel id="friends" className="outline-none">
          <FriendsList error={errors.friends} />
        </TabPanel>

        <TabPanel id="requests" className="outline-none">
          <RequestsList />
        </TabPanel>

        <TabPanel id="invitations" className="outline-none">
          <GameInvitationsList />
        </TabPanel>
      </SocialScrollContainer>
    </Tabs>
  );
}

export function SocialDashboard() {
  return (
    <Stack className="pointer-events-auto lg:h-full lg:min-h-0" gap="none">
      <SocialHeader />
      <main className="flex w-full lg:flex-1 lg:min-h-0">
        <SocialContent />
      </main>
    </Stack>
  );
}
