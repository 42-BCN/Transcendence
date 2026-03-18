import type { HTMLAttributes } from 'react';
import type React from 'react';
import { cn } from '@/lib/styles/cn';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Nivel de desenfoque trasera: 'none' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl' | '2xl' */
  blur?: 'none' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl' | '2xl';
  /** Nivel de opacidad de luz: 'low' | 'medium' | 'high' */
  intensity?: 'low' | 'medium' | 'high';
  /** Nivel de opacidad del borde: 'low' | 'medium' | 'high' */
  borderIntensity?: 'low' | 'medium' | 'high';
  /** Activar efecto saturación estilo Apple */
  saturate?: boolean;
}

const blurMap = {
  none: '',
  sm: 'backdrop-blur-sm',
  sm2: 'backdrop-blur-[6px]',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
};

const intensityMap = {
  low: 'bg-gradient-to-br from-white/[0.06] to-white/[0.01] dark:from-white/[0.03] dark:to-transparent',
  medium:
    'bg-gradient-to-br from-white/[0.18] to-white/[0.04] dark:from-white/[0.08] dark:to-transparent',
  high: 'bg-gradient-to-br from-white/[0.35] to-white/[0.10] dark:from-white/[0.16] dark:to-transparent',
};

const borderMap = {
  low: 'border border-white/[0.08] dark:border-white/[0.04]',
  medium: 'border border-white/[0.22] dark:border-white/[0.08]',
  high: 'border border-white/[0.40] dark:border-white/[0.15]',
};

export function GlassCard({
  children,
  className,
  blur = 'sm2',
  intensity = 'high',
  borderIntensity = 'medium',
  saturate = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        blurMap[blur],
        intensityMap[intensity],
        saturate && 'backdrop-saturate-[150%]',
        borderMap[borderIntensity],
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]',
        'rounded-3xl p-8',
        'transition-all duration-300',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
