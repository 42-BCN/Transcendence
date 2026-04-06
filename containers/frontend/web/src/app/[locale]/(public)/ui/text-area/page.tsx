'use client';
import { useState } from 'react';
import { Stack, Text, TextAreaField } from '@components';
import { useTranslations } from 'next-intl';

export default function TextAreaPage() {
  const t = useTranslations('pages.ui.textArea');
  const [value, setValue] = useState('');
  const handleChange = (value: string) => setValue(value);
  return (
    <Stack className="p-6 w-[400px]">
      <Text as="h1" variant="heading-lg">
        {t('title')}
      </Text>
      <TextAreaField
        value={value}
        onChange={handleChange}
        aria-label={t('ariaLabel')}
        maxLength={300}
      />
    </Stack>
  );
}
