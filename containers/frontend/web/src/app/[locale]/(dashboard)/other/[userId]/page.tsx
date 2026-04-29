import { PublicProfile } from '@/features/profile/public-profile';

interface OtherUserPageProps {
  params: Promise<{ userId: string }>;
}

export default async function OtherUserPage({ params }: OtherUserPageProps) {
  const { userId } = await params;

  return <PublicProfile userId={userId} />;
}
