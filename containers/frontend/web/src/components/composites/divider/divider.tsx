import { Text } from '@components/primitives/text';

export function Divider({ label }: { label: string }) {
  return (
    <Text variant="divider" className="text-text-disabled">
      {label}
    </Text>
  );
}
