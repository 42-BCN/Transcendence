'use client';

import { useTranslations } from 'next-intl';
import { UserItem } from '@/components/composites/user-item/user-item';
import { Stack } from '@/components/primitives/stack';
import { Text } from '@/components/primitives/text';
import { useSocialStore } from '../store/use-social-store';

export function SearchResults() {
  const t = useTranslations('features.social.emptyStates');
  const searchResults = useSocialStore((state) => state.searchResults);

  if (searchResults.length === 0) {
    return (
      <Stack align="center" justify="center" className="py-3 px-3 text-center">
        <Text variant="caption" color="tertiary">
          {t('search')}
        </Text>
      </Stack>
    );
  }

  return searchResults.map((user) => (
    <UserItem key={user.id} username={user.username} avatarUrl={user.avatar ?? undefined} />
  ));
}
