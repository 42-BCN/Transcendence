'use client';

import { Stack } from '@components/primitives/stack';
import { Form } from '@components/composites/form';
import { TextAreaField } from '@components/composites/text-area-field';

import { ChatHeader } from './chat.header';
import { ChatMain } from './chat.main';
import { chatStyles } from './chat.styles';
import { useChat } from './chat.provider';

function ChatContent() {
  const { messages, value, setValue, sendMessage } = useChat();

  return (
    <Stack gap="none" className={chatStyles.wrapper}>
      <ChatHeader room="chatTest" participants={['capapes', 'cmanica-', 'mfontser', 'mvelazqu']} />

      <ChatMain messages={messages} />

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <TextAreaField
          value={value}
          onChange={setValue}
          className={chatStyles.footer.input}
          aria-label="message"
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
