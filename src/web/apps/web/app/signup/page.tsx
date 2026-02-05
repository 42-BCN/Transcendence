import { SignupForm } from '@/components/features/auth/signup-form';

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">Create account</h1>
      <SignupForm />
    </main>
  );
}
