import { LoginFeature } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">Login Account</h1>
      <LoginFeature />
    </main>
  );
}
