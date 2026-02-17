import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().nonempty(),
});
export type LoginValues = z.infer<typeof loginSchema>;
