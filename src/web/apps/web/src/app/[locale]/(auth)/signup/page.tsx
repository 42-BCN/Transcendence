import { CreateAccount } from '@/features/auth/create-account';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';

export default function SignupPage() {
  return (
    <AuthPageLayout title="">
      <CreateAccount />
    </AuthPageLayout>
  );
}
