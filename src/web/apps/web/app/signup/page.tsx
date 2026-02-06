import { signupAction } from './actions';
import { SignupFeature } from '@/components/features/auth/signup-form';

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">Create account</h1>

      {/* ✅ Now it's actually used */}
      <SignupFeature action={signupAction} />
    </main>
  );
}
