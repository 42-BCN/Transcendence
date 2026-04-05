import { GlassCard } from '@components/primitives/glass-card';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Button } from '@components/controls/button';
import { getTranslations } from 'next-intl/server';

export default async function GlassCardPage() {
  const t = await getTranslations('pages.ui.glassCard');

  return (
    <Stack className="p-4" gap="md">
      <Text as="h1" variant="heading-lg">
        {t('title')}
      </Text>

      <div className="w-full h-[500px] relative rounded-3xl bg-cover bg-center flex items-center justify-center overflow-hidden bg-[url('/glass-bg.png')]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-transparent" />
        <GlassCard className="w-96" intensity="medium">
          <h3 className="text-2xl font-bold text-black mb-2">{t('cardTitle')}</h3>
          <p className="text-black/80 text-sm leading-relaxed mb-4">{t('description')}</p>
          <Button className="w-full bg-black text-white hover:bg-black/90 rounded-2xl">
            {t('cta')}
          </Button>
        </GlassCard>
      </div>
    </Stack>
  );
}
