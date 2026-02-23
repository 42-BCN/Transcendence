import { z } from 'zod';
import { AuthSignupRequestSchema } from '@/contracts/auth/auth.validation';
import { VALIDATION } from '@/contracts/http';

export const SignupFormSchema = AuthSignupRequestSchema.extend({
  confirmPassword: z.string().min(1, { message: VALIDATION.REQUIRED }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: VALIDATION.PASSWORDS_DO_NOT_MATCH,
    });
  }
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
