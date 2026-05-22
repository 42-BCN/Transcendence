/* eslint-disable local/no-literal-ui-strings */
import { DirectMessagesAccess, DirectMessagesFeature } from '@/features/direct-messages';
import { MessagesLayout } from '@/features/direct-messages/messages-layout';
import { getTranslations } from 'next-intl/server';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { protectedMeAction } from '@/features/auth/me/protected.action';
import { getFriendsList } from '@/features/social/actions/social.server.actions';

export default async function MessagesPage({ params }: { params: Promise<{ userId: string }> }) {
  const [{ userId: friendIdentifier }, currentUserId, me, friendsResult] = await Promise.all([
    params,
    getCurrentUserIdOrNull(),
    protectedMeAction().catch(() => null),
    getFriendsList(),
  ]);

  const friend = friendsResult.ok
    ? friendsResult.data.friends.find(
        (item) => item.username === friendIdentifier || item.id === friendIdentifier,
      )
    : undefined;
  const t = await getTranslations('features.directMessages');

  return (
    <MessagesLayout
      friends={friendsResult.ok ? friendsResult.data.friends : []}
      selectedUsername={friend?.username ?? friendIdentifier}
    >
      {currentUserId && me?.ok && friendsResult.ok && friend ? (
        <DirectMessagesFeature
          friendUserId={friend.id}
          friendUsername={friend.username}
          currentUserId={currentUserId}
          currentUsername={me.data.username}
        />
      ) : (
        <DirectMessagesAccess
          title={t('accessTitle')}
          body={
            currentUserId && me?.ok
              ? t('accessBody.authenticated')
              : t('accessBody.unauthenticated')
          }
        />
      )}
    </MessagesLayout>
  );
}
