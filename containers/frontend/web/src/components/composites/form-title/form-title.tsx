import { Text } from '@components/primitives/text';

export function FormTitle({ title }: { title: string }) {
  return (
    <Text as="h1" variant="heading-md">
      {title}
    </Text>
  );
}
