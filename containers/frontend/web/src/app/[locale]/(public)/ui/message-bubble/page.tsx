import { MessageBubble } from '@components/primitives/message-bubble';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { getTranslations } from 'next-intl/server';

export default async function MessageBubblePage() {
  const t = await getTranslations('pages.ui.messageBubble');

  return (
    <Stack className="p-4">
      <Text as="h1" variant="heading-lg">
        {t('title')}
      </Text>

      <Stack className="h-[400px] w-[400px]">
        <MessageBubble>
          <Text as="h2" variant="caption">
            {t('userOne')}
          </Text>
          <Text as="p">{t('messageOne')}</Text>
        </MessageBubble>
        <MessageBubble variant="me">
          <Text as="h2" variant="caption">
            {t('userTwo')}
          </Text>
          <Text as="p">{t('messageTwo')}</Text>
        </MessageBubble>
      </Stack>
    </Stack>
  );
}
