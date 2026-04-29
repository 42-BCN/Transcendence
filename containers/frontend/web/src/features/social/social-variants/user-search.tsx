'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSocialStore } from '../store/social-store.provider';
import { type GroupedSearchResults } from '../store/social-store.types';
import { emptyGroupedSearchResults, initialSearchMeta } from '../store/social-store';

import { searchUsers } from '../actions/users.actions';
import { TextField } from '@components';

import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';

const SEARCH_DEBOUNCE_MS = 300;

export function groupSearchResults(args: {
  users: SearchUserResult[];
  currentUserId: string | null;
  friends: FriendPublic[];
}): GroupedSearchResults {
  const { users, currentUserId, friends } = args;
  const grouped = emptyGroupedSearchResults();
  const onlineFriendIds = new Set(
    friends.filter((friend) => friend.isOnline).map((friend) => friend.id),
  );

  for (const user of users) {
    if (user.id === currentUserId) continue;

    if (user.friendshipStatus === 'none') {
      grouped.none.push(user);
      continue;
    }

    if (user.friendshipStatus === 'accepted') {
      if (onlineFriendIds.has(user.id)) grouped.online.push(user);
      else grouped.offline.push(user);

      continue;
    }

    if (user.friendshipStatus === 'pending') {
      if (user.senderId === currentUserId) grouped.pending.push(user);
      else grouped.requests.push(user);
    }
  }

  return grouped;
}

function useUserSearch() {
  const query = useSocialStore((state) => state.searchQuery);
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const friends = useSocialStore((state) => state.friends);
  const setSearchResults = useSocialStore((state) => state.setSearchResults);
  const setSearchMeta = useSocialStore((state) => state.setSearchMeta);

  useEffect(() => {
    let ignore = false;
    const trimmedQuery = query.trim();

    const runSearch = async () => {
      try {
        if (!trimmedQuery) {
          setSearchResults(emptyGroupedSearchResults());
          setSearchMeta(initialSearchMeta());
          return;
        }

        const result = await searchUsers(trimmedQuery);

        if (ignore) return;

        if (result.ok) {
          setSearchResults(
            groupSearchResults({
              users: result.data.users,
              currentUserId,
              friends,
            }),
          );
          setSearchMeta(result.data.meta);
        } else {
          setSearchResults(emptyGroupedSearchResults());
          setSearchMeta(initialSearchMeta());
        }
      } catch {
        if (!ignore) {
          setSearchResults(emptyGroupedSearchResults());
          setSearchMeta(initialSearchMeta());
        }
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, currentUserId, friends, setSearchResults, setSearchMeta]);
}

export function UserSearch() {
  const t = useTranslations('features.social');
  const query = useSocialStore((state) => state.searchQuery);
  const setQuery = useSocialStore((state) => state.setSearchQuery);

  useUserSearch();

  return (
    <TextField
      labelKey="features.social.searchLabel"
      inputProps={{
        placeholder: t('searchPlaceholder'),
        icon: 'search',
      }}
      value={query}
      onChange={setQuery}
    />
  );
}

export function SearchLoadMore() {
  const hasMore = useSocialStore((state) => state.searchMeta.hasMore);
  const query = useSocialStore((state) => state.searchQuery);
  const meta = useSocialStore((state) => state.searchMeta);
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const friends = useSocialStore((state) => state.friends);
  const appendSearchResults = useSocialStore((state) => state.appendSearchResults);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || !query.trim()) return;

    const queryAtStart = query;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const nextOffset = meta.offset + meta.limit;
      const result = await searchUsers(query, meta.limit, nextOffset);

      // Prevent race condition: check if query has changed while the request was in-flight
      const currentQuery = useSocialStore.getState().searchQuery;
      if (currentQuery !== queryAtStart) return;

      if (result.ok) {
        appendSearchResults(
          groupSearchResults({
            users: result.data.users,
            currentUserId,
            friends,
          }),
          result.data.meta,
        );
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, query, meta, currentUserId, friends, appendSearchResults]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: '400px' },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [loadMore, hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center py-4">
      {isLoading && (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </div>
  );
}
