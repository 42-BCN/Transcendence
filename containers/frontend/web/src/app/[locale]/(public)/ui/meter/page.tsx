import { Meter } from '@components/composites/meter';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function MeterPage() {
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        Meter
      </Text>
      <Meter label="hp" value={25} />
    </Stack>
  );
}
