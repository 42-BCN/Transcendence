import { PublicProfile } from '@/features/profile/public-profile';

interface OtherUserPageProps {
  params: Promise<{ username: string }>;
}

export default async function OtherUserPage({ params }: OtherUserPageProps) {
  const { username } = await params;

  return <PublicProfile username={username} />;
}
