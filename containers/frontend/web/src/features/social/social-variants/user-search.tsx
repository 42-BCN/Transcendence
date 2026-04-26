'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@components';
import { useSocialStore } from '../store/use-social-store';
import { searchUsers } from '../actions/users.actions';

export function UserSearch() {
  const t = useTranslations('features.social');
  const query = useSocialStore((state) => state.searchQuery);
  const setQuery = useSocialStore((state) => state.setSearchQuery);
  const setSearchResults = useSocialStore((state) => state.setSearchResults);

  useEffect(() => {
    let ignore = false;
    // 300ms debounce as per original issue requirement
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        if (!ignore) setSearchResults([]);
        return;
      }

      const result = await searchUsers(query);
      if (!ignore) {
        if (result.ok) {
          setSearchResults(result.data.users);
        } else {
          setSearchResults([]);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, setSearchResults]);

  return (
    <SearchInput
      labelKey="features.social.searchLabel"
      inputProps={{
        placeholder: t('searchPlaceholder'),
      }}
      value={query}
      onChange={setQuery}
    />
  );
}
