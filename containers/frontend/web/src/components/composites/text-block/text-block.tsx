import { Text } from '@components/primitives/text';
import type { ReactNode } from 'react';

type MessageBlockProps = {
  title: ReactNode;
  messages: ReactNode[];
};

export function MessageBlock({ title, messages }: MessageBlockProps) {
  return (
    <>
      <Text as="h1" variant="heading-md">
        {title}
      </Text>

      {messages.map((message, index) => (
        <Text key={index} as="p" variant="body-sm">
          {message}
        </Text>
      ))}
    </>
  );
}
