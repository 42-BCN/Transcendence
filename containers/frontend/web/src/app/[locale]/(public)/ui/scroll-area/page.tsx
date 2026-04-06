import { ScrollArea, Stack, Text } from '@components';
import { getTranslations } from 'next-intl/server';

function Item({ index, label }: { index: number; label: string }) {
  return (
    <div className="min-h-6 min-w-6 rounded-sm bg-slate-500 px-2 py-1 text-white">
      {label} {index}
    </div>
  );
}

export default async function ScrollAreaPage() {
  const t = await getTranslations('pages.ui.scrollArea');

  return (
    <Stack className="p-4">
      <Text as="h1" variant="heading-lg">
        {t('title')}
      </Text>

      <Text as="p">{t('description')}</Text>

      <Text as="h2" variant="heading-md">
        {t('example')}
      </Text>

      <div className="h-[400px] w-[400px]">
        <ScrollArea>
          <Stack gap="sm" className="p-2">
            {Array.from({ length: 30 }, (_, index) => (
              <Item key={index} index={index + 1} label={t('itemLabel')} />
            ))}
          </Stack>
        </ScrollArea>
      </div>
    </Stack>
  );
}
