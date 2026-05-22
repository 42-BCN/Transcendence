import { DirectMessagesAccess, DirectMessagesFeature } from '@/features/direct-messages';
import { MessagesLayout } from '@/features/direct-messages/messages-layout';
import { getTranslations } from 'next-intl/server';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { protectedMeAction } from '@/features/auth/me/protected.action';
import { getFriendsList } from '@/features/social/actions/social.server.actions';

export default async function MessagesIndexPage() {
  const [currentUserId, me, friendsResult] = await Promise.all([
    getCurrentUserIdOrNull(),
    protectedMeAction().catch(() => null),
    getFriendsList(),
  ]);

  const friends = friendsResult.ok ? friendsResult.data.friends : [];
  const firstFriend = friends[0];

  const t = await getTranslations('features.directMessages');

  return (
    <MessagesLayout friends={friends} selectedUsername={firstFriend?.username}>
      {currentUserId && me?.ok && friends.length > 0 && firstFriend ? (
        <DirectMessagesFeature
          friendUserId={firstFriend.id}
          friendUsername={firstFriend.username}
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
