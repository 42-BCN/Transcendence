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

const cardLayout = [
  'shadow-[0_8px_32px_rgba(var(--color-shadow-rgb),var(--color-shadow-opacity))]',
  'rounded-3xl p-8',
  'transition-all duration-300',
];

export type GlassBlur = keyof typeof blur;
export type GlassIntensity = keyof typeof intensity;
export type GlassBorder = keyof typeof border;

export type GlassBackgroundStylesOpts = {
  blur?: GlassBlur;
  intensity?: GlassIntensity;
  saturate?: boolean;
};

export type GlassBorderStylesOpts = {
  border?: GlassBorder;
};

export type GlassCardStylesOpts = GlassBackgroundStylesOpts &
  GlassBorderStylesOpts & {
    className?: string;
  };

export function glassBackgroundStyles(opts: GlassBackgroundStylesOpts = {}) {
  return cn(
    blur[opts.blur ?? 'sm2'],
    intensity[opts.intensity ?? 'medium'],
    opts.saturate !== false && 'backdrop-saturate-[150%]',
  );
}

export function glassBorderStyles(opts: GlassBorderStylesOpts = {}) {
  return cn(border[opts.border ?? 'medium']);
}

export function glassCardStyles(opts: GlassCardStylesOpts = {}) {
  return cn(glassBackgroundStyles(opts), glassBorderStyles(opts), cardLayout, opts.className);
}
