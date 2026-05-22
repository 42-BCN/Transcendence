import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';

const MINUTE_IN_MS = 60_000;
const HOUR_IN_MINUTES = 60;
const DAY_IN_HOURS = 24;

export type SocialListItem = {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  subtitle?: string;
};

export function formatRequestAge({
  createdAt,
  now,
  locale,
  nowLabel,
}: {
  createdAt: string;
  now: number;
  locale: string;
  nowLabel: string;
}) {
  const createdAtMs = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) return;

  const diffMs = now - createdAtMs;

  if (diffMs < MINUTE_IN_MS) return nowLabel;

  const diffMinutes = Math.floor(diffMs / MINUTE_IN_MS);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'short' });

  if (diffMinutes < HOUR_IN_MINUTES) return formatter.format(-diffMinutes, 'minute');

  const diffHours = Math.floor(diffMinutes / HOUR_IN_MINUTES);

  if (diffHours < DAY_IN_HOURS) return formatter.format(-diffHours, 'hour');

  return formatter.format(-Math.floor(diffHours / DAY_IN_HOURS), 'day');
}

export function mapFriendToListItem(friend: FriendPublic): SocialListItem {
  return {
    id: friend.id,
    userId: friend.id,
    username: friend.username,
    avatar: friend.avatar,
  };
}

export function mapFriendshipToListItem(
  friendship: FriendshipPublic,
  subtitle?: string,
): SocialListItem {
  return {
    id: friendship.id,
    userId: friendship.userId,
    username: friendship.username,
    avatar: friendship.avatar,
    subtitle,
  };
}

export function mapSearchResultToListItem(
  result: SearchUserResult,
  subtitle?: string,
): SocialListItem {
  return {
    id: result.id,
    userId: result.id,
    username: result.username,
    avatar: result.avatar,
    subtitle,
  };
}
