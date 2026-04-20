import { Text } from '@components/primitives/text';
import type { ReactNode } from 'react';
import { FormTitle } from '../form-title/form-title';

type MessageBlockProps = {
  title: string;
  messages: ReactNode[];
};

export function MessageBlock({ title, messages }: MessageBlockProps) {
  return (
    <>
      {/* TODO: maybe change this component name to something more generic */}
      <FormTitle title={title} />

      {messages.map((message, index) => (
        <Text key={index} as="p" variant="body-sm">
          {message}
        </Text>
      ))}
    </>
  );
}
