'use client';
import { useState } from 'react';
import { TextAreaField } from '@components/composites/text-area-field';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export default function TextAreaPage() {
  const [value, setValue] = useState('');
  const handleChange = (value: string) => setValue(value);
  return (
    <Stack className="p-6 w-[400px]">
      <Text as="h1" variant="heading-lg">
        Text field component
      </Text>
      <TextAreaField value={value} onChange={handleChange} aria-label="message" maxLength={300} />
    </Stack>
  );
}
