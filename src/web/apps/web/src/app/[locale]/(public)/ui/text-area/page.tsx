import { TextArea } from '@components/controls/text-area';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function TextAreaPage() {
  return (
    <Stack className="p-6">
      <Text as="h1" variant="heading-lg">
        Text area
      </Text>
      <Text as="h2" variant="heading-sm">
        Text area component
      </Text>
      <div className="w-[400px]">
        <TextArea></TextArea>
      </div>
      <Text as="h2" variant="heading-sm">
        Text field component
      </Text>
    </Stack>
  );
}
