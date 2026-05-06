'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSocialStore } from '@/providers/social-provider';
import { type GroupedSearchResults } from '../store/social-store.types';
import { emptyGroupedSearchResults } from '../store/social-store.reducers';

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
    friends.filter((friend) => friend.presence !== 'offline').map((friend) => friend.id),
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

  useEffect(() => {
    let ignore = false;
    const trimmedQuery = query.trim();

    const runSearch = async () => {
      try {
        if (!trimmedQuery) {
          setSearchResults(emptyGroupedSearchResults());
          return;
        }

        const result = await searchUsers(trimmedQuery);

        if (ignore) return;

        setSearchResults(
          result.ok
            ? groupSearchResults({
                users: result.data.users,
                currentUserId,
                friends,
              })
            : emptyGroupedSearchResults(),
        );
      } catch {
        if (!ignore) setSearchResults(emptyGroupedSearchResults());
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, currentUserId, friends, setSearchResults]);
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
