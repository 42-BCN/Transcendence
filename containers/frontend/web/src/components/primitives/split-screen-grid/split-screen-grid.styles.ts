import { cn } from '@/lib/styles/cn';

export type SplitScreenGridMobileStackMode = 'full' | 'split';
export type SplitScreenGridMobileSideLayout = 'stack' | 'overlay';

type SplitScreenGridStylesArgs = {
  mobileStackMode: SplitScreenGridMobileStackMode;
  mobileSideLayout: SplitScreenGridMobileSideLayout;
};

export function splitScreenGridStyles({
  mobileStackMode,
  mobileSideLayout,
}: SplitScreenGridStylesArgs) {
  const isMobileSplit = mobileStackMode === 'split';
  const mobileFullHeight = isMobileSplit ? 'h-[30dvh]' : 'h-screen h-[100dvh]';
  const mobileSideHeight = isMobileSplit ? 'h-[70dvh]' : 'h-screen h-[100dvh]';
  const mobileSidePosition =
    mobileSideLayout === 'overlay' ? 'absolute inset-0 h-screen h-[100dvh]' : mobileSideHeight;

  return {
    wrapper:
      'relative flex w-full flex-col md:absolute md:inset-0 md:grid md:max-h-screen md:max-h-[100dvh] md:flex-1 md:grid-cols-[8fr_4fr]',
    full: cn(
      `relative order-1 min-w-0 overflow-hidden ${mobileFullHeight} md:order-none md:col-span-2 md:col-start-1 md:row-start-1 md:h-screen md:h-[100dvh]`,
    ),
    side: cn(
      `z-30 order-2 min-w-0 ${mobileSidePosition} pointer-events-none md:order-none md:relative md:col-start-2 md:row-start-1 md:h-screen md:h-[100dvh] md:inset-auto`,
    ),
  };
}
