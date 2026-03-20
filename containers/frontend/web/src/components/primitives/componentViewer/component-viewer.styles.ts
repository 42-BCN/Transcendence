import { cn } from '@/lib/styles/cn';

const wrapperBase = 'border flex flex-col p-2 gap-1 bg-slate-50';
const labelBase = 'text-xs';

export const componentViewerStyles = {
  wrapper: () => cn(wrapperBase),
  label: () => cn(labelBase),
};
