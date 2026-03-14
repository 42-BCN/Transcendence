import { TextAreaField } from '@components/composites/text-area-field';
import { TextArea } from '@components/controls/text-area';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function TextAreaPage() {
  return (
    <Stack className="p-6 w-[400px]">
      <Text as="h1" variant="heading-lg">
        Text area
      </Text>
      <Text as="h2" variant="heading-sm">
        Text area component
      </Text>

      <TextArea></TextArea>

      <Text as="h2" variant="heading-sm">
        Text field component
      </Text>
      <TextAreaField maxLength={300} />
    </Stack>
  );
}
