import { cn } from '@/lib/styles/cn';

const wrapperBase = 'mx-auto min-w-[320px] p-3';
const titleBase = 'mb-6 text-xl font-semibold';

export const authPageLayoutStyles = {
  wrapper: () => cn(wrapperBase),
  title: () => cn(titleBase),
};
