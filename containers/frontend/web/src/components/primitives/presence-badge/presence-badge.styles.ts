import { cn } from '@/lib/styles/cn';

const presenceColor = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-neutral-400',
} as const;

const presenceSize = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
} as const;

export type PresenceStatus = keyof typeof presenceColor;
export type PresenceBadgeSize = keyof typeof presenceSize;

type PresenceBadgeStylesProps = {
  presence: PresenceStatus;
  size?: PresenceBadgeSize;
  className?: string;
};

export function presenceBadgeStyles({
  presence,
  size = 'md',
  className,
}: PresenceBadgeStylesProps) {
  return cn(
    'rounded-full border-2 border-bg-primary shrink-0',
    presenceColor[presence],
    presenceSize[size],
    className,
  );
}
