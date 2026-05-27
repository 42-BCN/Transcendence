import { cn } from '@/lib/styles/cn';

const panelBase =
  'pointer-events-auto h-full w-full overflow-hidden rounded-xl border-l border-gray-200/20 p-5 pt-11';

export const directMessagesStyles = {
  access: {
    wrapper: panelBase,
    title: 'font-bold',
  },
  selection: {
    wrapper: cn(panelBase, 'text-center'),
    title: 'font-bold',
  },
};
