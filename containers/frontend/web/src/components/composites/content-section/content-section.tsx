import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
import type { ReactNode } from 'react';

type ContentSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  items?: ReactNode[];
  children?: ReactNode;
  as?: 'section' | 'article' | 'header' | 'div';
};

export function ContentSection({
  title,
  description,
  items,
  children,
  as = 'section',
}: ContentSectionProps) {
  return (
    <Stack as={as} gap="sm">
      {title && (
        <Text as="h2" variant="heading-sm">
          {title}
        </Text>
      )}
      {description && (
        <Text as="p" variant="body" color="secondary">
          {description}
        </Text>
      )}
      {items && items.length > 0 && (
        <ul className="list-disc pl-6 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <Text as="span" variant="body" color="secondary">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {children}
    </Stack>
  );
}
