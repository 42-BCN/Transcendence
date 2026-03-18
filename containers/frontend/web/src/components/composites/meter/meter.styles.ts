import { cn } from '@/lib/styles/cn';

const bar =
  'h-2 rounded-full bg-neutral-300 dark:bg-neutral-700 outline outline-1 -outline-offset-1 outline-transparent relative';
const label = 'font-caption';
const header = 'flex justify-between gap-2';

const barPercentBase = 'absolute top-0 left-0 h-full rounded-full forced-colors:bg-[Highlight]';
const barPercentColor = (percentage: number) => {
  if (percentage >= 50) return 'bg-green-600';
  if (percentage > 25) return 'bg-orange-500';
  return 'bg-red-600';
};

const progressTextBase = 'font-body-xs';
const progressTextColor = (percentage: number) =>
  percentage >= 80 ? 'text-red-600 dark:text-red-500' : 'text-neutral-600 dark:text-neutral-400';

const mainBase = 'flex flex-col gap-2 font-sans max-w-full';

export const meterStyles = {
  barPercent: (percentage: number) => cn(barPercentBase, barPercentColor(percentage)),
  bar,
  label,
  header,
  progressText: (percentage: number) => cn(progressTextBase, progressTextColor(percentage)),
  main: (className: string | undefined) => cn(className, mainBase),
};
