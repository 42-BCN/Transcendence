'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@components';
import { useSocialStore } from '../store/use-social-store';
import { searchUsers } from '../actions/users.actions';

export function UserSearch() {
  const t = useTranslations('features.social');
  const [query, setQuery] = useState('');
  const setSearchResults = useSocialStore((state) => state.setSearchResults);

  useEffect(() => {
    // 300ms debounce as per original issue requirement
    const timer = setTimeout(() => {
      const performSearch = async () => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        const result = await searchUsers(query);
        if (result.ok) {
          setSearchResults(result.data);
        } else {
          setSearchResults([]);
        }
      };

      void performSearch();
    }, 300);

    return () => clearTimeout(timer);
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
