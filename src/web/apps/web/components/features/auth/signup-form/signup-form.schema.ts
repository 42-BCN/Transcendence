import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),

    password: z.string().min(8, 'At least 8 characters'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
