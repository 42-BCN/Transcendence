type CountBadgeTone = 'danger';
type CountBadgePlacement = 'inline' | 'overlay';

export type CountBadgeProps = {
  count?: number;
  max?: number;
  tone?: CountBadgeTone;
  placement?: CountBadgePlacement;
  className?: string;
};

const toneClassName: Record<CountBadgeTone, string> = {
  danger: 'bg-rose-500 text-white',
};

const placementClassName: Record<CountBadgePlacement, string> = {
  inline: 'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-5',
  overlay:
    'absolute end-0 top-0 inline-flex min-w-4 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none',
};

export function CountBadge({
  count,
  max = 99,
  tone = 'danger',
  placement = 'inline',
  className,
}: CountBadgeProps) {
  if (typeof count !== 'number' || count <= 0) {
    return null;
  }

  const label = count > max ? `${max}+` : String(count);

  return (
    <span className={`${placementClassName[placement]} ${toneClassName[tone]} ${className ?? ''}`}>
      {label}
    </span>
  );
}
