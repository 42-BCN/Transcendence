import { GlassCard } from '@components/primitives/glass-card';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { Button } from '@components/controls/button';

export default function GlassCardPage() {
  return (
    <Stack className="p-4" gap="md">
      <Text as="h1" variant="heading-lg">
        Glassmorphism Card
      </Text>

      <div className="w-full h-[500px] relative rounded-3xl bg-cover bg-center flex items-center justify-center overflow-hidden bg-[url('/glass-bg.png')]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-transparent" />
        <GlassCard className="w-96" intensity="medium">
          <h3 className="text-2xl font-bold text-black mb-2">Glassmorphism</h3>
          <p className="text-black/80 text-sm leading-relaxed mb-4">
            A glassmorphic card component using backdrop-filters, transparent borders and subtle
            shadows to blend with any rich textured background.
          </p>
          <Button className="w-full bg-black text-white hover:bg-black/90 rounded-2xl">
            Get Started
          </Button>
        </GlassCard>
      </div>
    </Stack>
  );
}
