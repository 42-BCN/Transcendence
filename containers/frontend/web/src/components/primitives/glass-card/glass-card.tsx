import type { HTMLAttributes, ReactNode } from 'react';

import { glassCardStyles } from './glass-card.styles';
import type { GlassBlur, GlassIntensity, GlassBorder } from './glass-card.styles';

export type GlassCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
  children?: ReactNode;
  className?: string;
  blur?: GlassBlur;
  intensity?: GlassIntensity;
  borderIntensity?: GlassBorder;
  saturate?: boolean;
};

export function GlassCard({
  children,
  className,
  blur = 'sm2',
  intensity = 'medium',
  borderIntensity = 'medium',
  saturate = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={glassCardStyles({
        blur,
        intensity,
        border: borderIntensity,
        saturate,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
