import { cn } from '@/lib/styles/cn';

const base = 'flex';
const direction = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
} as const;

const gap = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
} as const;

const align = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

const justify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const;

type rootProps = {
  direction?: keyof typeof direction;
  gap?: keyof typeof gap;
  align?: keyof typeof align;
  justify?: keyof typeof justify;
  className?: string;
};

export function stackStyles(opts: rootProps) {
  const {
    direction: dir = 'vertical',
    gap: gapSize = 'md',
    align: alignItems = 'stretch',
    justify: justifyContent = 'start',
    className,
  } = opts;

  return cn(
    base,
    direction[dir],
    gap[gapSize],
    align[alignItems],
    justify[justifyContent],
    className,
  );
}
