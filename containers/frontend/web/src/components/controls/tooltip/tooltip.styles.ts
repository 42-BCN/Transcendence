import { cn } from '@/lib/styles/cn';

const tooltipBase = `
  font-caption
  text-white dark:text-black
  group
  bg-slate-100
  border border-slate-200 
  
  rounded-md
  will-change-transform
  px-2 py-2
  box-border

  data-[entering]:animate-in
  data-[entering]:fade-in
  data-[entering]:ease-out
  data-[entering]:duration-200

  data-[exiting]:animate-out
  data-[exiting]:fade-out
  data-[exiting]:ease-in
  data-[exiting]:duration-150

  data-[placement=bottom]:data-[entering]:slide-in-from-top-0.5
  data-[placement=top]:data-[entering]:slide-in-from-bottom-0.5
  data-[placement=left]:data-[entering]:slide-in-from-right-0.5
  data-[placement=right]:data-[entering]:slide-in-from-left-0.5

  data-[placement=bottom]:data-[exiting]:slide-out-to-top-0.5
  data-[placement=top]:data-[exiting]:slide-out-to-bottom-0.5
  data-[placement=left]:data-[exiting]:slide-out-to-right-0.5
  data-[placement=right]:data-[exiting]:slide-out-to-left-0.5
`;

export const tooltipStyles = {
  tooltip: cn(tooltipBase),

  arrow: cn(`
    block
    fill-slate-100 
    forced-colors:fill-[Canvas]

    stroke-slate-200 
    forced-colors:stroke-[ButtonBorder]

    group-data-[placement=bottom]:rotate-180
    group-data-[placement=left]:-rotate-90
    group-data-[placement=right]:rotate-90
  `),
};
