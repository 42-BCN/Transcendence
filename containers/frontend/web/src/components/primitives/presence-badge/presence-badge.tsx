import {
  presenceBadgeStyles,
  type PresenceBadgeSize,
  type PresenceStatus,
} from './presence-badge.styles';

export type PresenceBadgeProps = {
  presence: PresenceStatus;
  size?: PresenceBadgeSize;
  className?: string;
};

export function PresenceBadge({ presence, size = 'md', className }: PresenceBadgeProps) {
  return (
    <span
      role="status"
      aria-label={presence}
      className={presenceBadgeStyles({ presence, size, className })}
    />
  );
}
