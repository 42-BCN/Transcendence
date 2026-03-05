// import { z } from 'zod';
// import { SignupReqSchema } from '@/contracts/auth/auth.validation';
// import { VALIDATION } from '@/contracts/http';

// export const SignupFormSchema = SignupReqSchema.extend({
//   confirmPassword: z.string().min(1, { message: VALIDATION.REQUIRED }),
// }).superRefine(({ password, confirmPassword }, ctx) => {
//   if (password !== confirmPassword) {
//     ctx.addIssue({
//       code: 'custom',
//       path: ['confirmPassword'],
//       message: VALIDATION.PASSWORDS_DO_NOT_MATCH,
//     });
//   }
// });

// export type SignupFormValues = z.infer<typeof SignupFormSchema>;
