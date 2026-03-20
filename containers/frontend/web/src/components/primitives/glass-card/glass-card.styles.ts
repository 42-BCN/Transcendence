import { cn } from '@/lib/styles/cn';

// Backdrop blur level
const blur = {
  none: '',
  sm: 'backdrop-blur-sm',
  sm2: 'backdrop-blur-[6px]',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
} as const;

// Light opacity level
const intensity = {
  low: 'bg-gradient-to-br from-white/[0.06] to-white/[0.01] dark:from-white/[0.03] dark:to-transparent',
  medium:
    'bg-gradient-to-br from-white/[0.18] to-white/[0.04] dark:from-white/[0.08] dark:to-transparent',
  high: 'bg-gradient-to-br from-white/[0.35] to-white/[0.10] dark:from-white/[0.16] dark:to-transparent',
} as const;

// Border opacity level
const border = {
  low: 'border border-white/[0.08] dark:border-white/[0.04]',
  medium: 'border border-white/[0.22] dark:border-white/[0.08]',
  high: 'border border-white/[0.40] dark:border-white/[0.15]',
} as const;

export type GlassBlur = keyof typeof blur;
export type GlassIntensity = keyof typeof intensity;
export type GlassBorder = keyof typeof border;

type GlassStylesOpts = {
  blur?: GlassBlur;
  intensity?: GlassIntensity;
  border?: GlassBorder;
  saturate?: boolean;
  className?: string;
};

export function glassCardStyles(opts: GlassStylesOpts = {}) {
  return cn(
    blur[opts.blur ?? 'sm2'],
    intensity[opts.intensity ?? 'medium'],
    opts.saturate && 'backdrop-saturate-[150%]',
    border[opts.border ?? 'medium'],
    'shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]',
    'rounded-3xl p-8',
    'transition-all duration-300',
    opts.className,
  );
}
