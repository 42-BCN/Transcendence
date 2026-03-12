import { RecoverFeature } from '@/features/auth/recover';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';

export default function RecoverPage() {
  return (
    <AuthPageLayout title="">
      <RecoverFeature />
    </AuthPageLayout>
  );
}
