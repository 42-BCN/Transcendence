import { LoginFeature } from '@/components/features/auth/login-form';

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">Login Acount</h1>

      {/* ✅ Now it's actually used */}
      <LoginFeature />
    </main>
  );
}
