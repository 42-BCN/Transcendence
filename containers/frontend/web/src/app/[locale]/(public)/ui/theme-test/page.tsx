import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
export default function ThemeTestPage() {
  return (
    <div className="min-h-screen p-8 text-text-primary">
      <Stack gap="xl">
        <Stack gap="md">
          <Text as="h1" variant="heading-xl">
            Theme Test Page
          </Text>
          <Text as="p" variant="body">
            This page demonstrates the dark/light mode implementation. All colors here use CSS
            variables synchronized with Tailwind.
          </Text>
        </Stack>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-6 rounded-lg border border-text-tertiary bg-bg-secondary">
            <Text as="h2" variant="heading-md">
              Secondary Background
            </Text>
            <Text as="p" variant="body-sm" className="mt-4">
              This card uses `bg-bg-secondary`. It should look slightly different from the main
              background in both modes.
            </Text>
          </section>

          <section className="p-6 rounded-lg border border-text-tertiary">
            <Text as="h2" variant="heading-md">
              Text Variants
            </Text>
            <Stack gap="xs" className="mt-4">
              <Text as="p" variant="body" className="text-text-primary">
                Primary Text
              </Text>
              <Text as="p" variant="body" className="text-text-secondary">
                Secondary Text
              </Text>
              <Text as="p" variant="body" className="text-text-tertiary">
                Tertiary Text
              </Text>
              <Text as="p" variant="body" className="text-text-disabled">
                Disabled Text
              </Text>
            </Stack>
          </section>
        </div>
      </Stack>
    </div>
  );
}
