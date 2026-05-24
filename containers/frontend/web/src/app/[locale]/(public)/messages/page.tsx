import { DirectMessagesAccess } from '@/features/direct-messages';
import { MessagesLayout } from '@/features/direct-messages/messages-layout';
import { getTranslations } from 'next-intl/server';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { protectedMeAction } from '@/features/auth/me/protected.action';
import { getFriendsList } from '@/features/social/actions/social.server.actions';
import { Stack, Text } from '@components';
import { directMessagesStyles } from '@/features/direct-messages/direct-messages.styles';

export default async function MessagesIndexPage() {
  const [currentUserId, me, friendsResult] = await Promise.all([
    getCurrentUserIdOrNull(),
    protectedMeAction().catch(() => null),
    getFriendsList(),
  ]);

  const friends = friendsResult.ok ? friendsResult.data.friends : [];
  const t = await getTranslations('features.directMessages');

  return (
    <MessagesLayout friends={friends}>
      {currentUserId && me?.ok && friends.length > 0 ? (
        <Stack
          gap="sm"
          align="center"
          justify="center"
          className={directMessagesStyles.selection.wrapper}
        >
          <Text as="h1" variant="heading-md" className={directMessagesStyles.selection.title}>
            {t('selectionTitle')}
          </Text>
          <Text color="secondary" variant="body-sm">
            {t('selectionBody')}
          </Text>
        </Stack>
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
