import { cn } from '@/lib/styles/cn';

export type SplitScreenGridMobileStackMode = 'full' | 'split';
export type SplitScreenGridMobileSideLayout = 'stack' | 'overlay';

type SplitScreenGridStylesArgs = {
  mobileStackMode: SplitScreenGridMobileStackMode;
  mobileSideLayout: SplitScreenGridMobileSideLayout;
  mobileFullClassName?: string;
  mobileSideClassName?: string;
};

export function splitScreenGridStyles({
  mobileStackMode,
  mobileSideLayout,
  mobileFullClassName,
  mobileSideClassName,
}: SplitScreenGridStylesArgs) {
  const isMobileSplit = mobileStackMode === 'split';
  const mobileFullHeight = mobileFullClassName ?? (isMobileSplit ? 'min-h-[60dvh]' : 'h-[100dvh]');
  const mobileSideHeight = mobileSideClassName ?? (isMobileSplit ? 'min-h-[40dvh]' : 'h-[100dvh]');
  const mobileSidePosition =
    mobileSideLayout === 'overlay' ? 'absolute inset-0 h-[100dvh]' : mobileSideHeight;

  return {
    wrapper:
      'relative flex w-full flex-col lg:absolute lg:inset-0 lg:grid lg:max-h-screen lg:max-h-[100dvh] lg:flex-1 lg:grid-cols-[8fr_4fr]',
    full: cn(
      `relative order-1 min-w-0 ${mobileFullHeight} lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:h-screen lg:h-[100dvh] lg:overflow-hidden`,
    ),
    side: cn(
      `z-30 order-2 min-w-0 ${mobileSidePosition} pointer-events-none lg:order-none lg:relative lg:col-start-2 lg:row-start-1 lg:h-screen lg:h-[100dvh] lg:inset-auto`,
    ),
  };
}
