'use client';

import { Form, Stack, TextAreaField } from '@components';

import { ChatHeader } from './chat.header';
import { ChatMain } from './chat.main';
import { chatStyles } from './chat.styles';
import { useChat } from './chat.provider';
import { useTranslations } from 'next-intl';

function ChatContent() {
  const { messages, value, setValue, sendMessage } = useChat();
  const t = useTranslations('features.chat');

  return (
    <Stack gap="none" className={chatStyles.wrapper}>
      <ChatHeader room="chatTest" participants={['capapes', 'cmanica-', 'mfontser', 'mvelazqu']} />

      <ChatMain messages={messages} />

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className={chatStyles.footer.wrapper}
      >
        <TextAreaField
          value={value}
          onChange={setValue}
          className={chatStyles.footer.input}
          aria-label={t('messageAriaLabel')}
          maxLength={300}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
      </Form>
    </Stack>
  );
}

export function ChatFeature({ isVisible }: { isVisible: boolean }) {
  return isVisible && <ChatContent />;
}
