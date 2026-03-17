import { ProtectedButton } from '@/features/auth/me/protected-button';

export default function MePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Protected route test</h1>
      <ProtectedButton />
      <p className="text-sm opacity-70">
        Click the button. If logged in, you should see user info. If not, you should get 401.
      </p>
    </main>
  );
}
