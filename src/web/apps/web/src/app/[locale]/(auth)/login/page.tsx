import { Login } from '@/features/auth/login';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';

export default function LoginPage() {
  return (
    <AuthPageLayout title="">
      <Login />
    </AuthPageLayout>
  );
}
