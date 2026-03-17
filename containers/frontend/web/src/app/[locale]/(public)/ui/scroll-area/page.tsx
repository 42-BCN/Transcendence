import { ScrollArea } from '@components/primitives/scroll-area';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

function Item({ index }: { index: number }) {
  return (
    <div className="min-h-6 min-w-6 rounded-sm bg-slate-500 px-2 py-1 text-white">Item {index}</div>
  );
}

export default function ScrollAreaPage() {
  return (
    <Stack className="p-4">
      <Text as="h1" variant="heading-lg">
        Scroll Area
      </Text>

      <Text as="p">
        This component is a div that takes a height of 100% and creates a scrollable area.
      </Text>

      <Text as="h2" variant="heading-md">
        Example
      </Text>

      <div className="h-[400px] w-[400px]">
        <ScrollArea>
          <Stack gap="sm">
            {Array.from({ length: 30 }, (_, index) => (
              <Item key={index} index={index + 1} />
            ))}
          </Stack>
        </ScrollArea>
      </div>
    </Stack>
  );
}
