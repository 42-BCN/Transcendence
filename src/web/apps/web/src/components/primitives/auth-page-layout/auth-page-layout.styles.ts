import { cn } from '@/lib/styles/cn';

const wrapperBase = 'mx-auto max-w-md p-6';
const titleBase = 'mb-6 text-xl font-semibold';

export const authPageLayoutStyles = {
  wrapper: () => cn(wrapperBase),
  title: () => cn(titleBase),
}; //es como si fuera una etructura (de c) con dos miembros (estructura que tiene guardada una funcion)
