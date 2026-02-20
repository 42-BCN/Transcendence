'use client';

// import { Form } from '@components/composites/form';
// import { useSignupForm } from './use-signup-form.hook';
// import { TextField } from '@components/composites/text-field';
// import { Button } from '@components/controls/button';

// export type SignupFeatureProps = {
//   action: (formData: FormData) => void | Promise<void>;
// };

// export function SignupFeature({ action }: SignupFeatureProps) {
//   const form = useSignupForm();

//   return (
//     <Form
//       action={action}
//       method="POST"
//       onSubmit={(e) => {
//         const res = form.validateBeforeSubmit();
//         if (!res.ok) e.preventDefault();
//       }}
//     >
//       {form.fieldsBase.map((base) => (
//         <TextField key={String(base.name)} {...base} {...form.getTextFieldProps(base.name)} />
//       ))}

//       <Button type="submit">Sign up</Button>
//     </Form>
//   );
// }
