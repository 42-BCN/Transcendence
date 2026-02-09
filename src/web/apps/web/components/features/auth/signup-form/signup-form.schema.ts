import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(8, 'Minimum 8 characters'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password.length >= 8 && confirmPassword.length >= 8 && password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'], // <-- ensures errors.confirmPassword is set
        message: 'Passwords do not match',
      });
    }
  });
export type SignupValues = z.infer<typeof signupSchema>;
