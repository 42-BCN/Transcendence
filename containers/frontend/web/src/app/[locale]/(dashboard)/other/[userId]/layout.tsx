import type { ReactNode } from 'react';
import { Stack, Avatar, Text } from '@components';
import { getPublicProfileAction } from '@/features/profile/profile.action';
import { notFound } from 'next/navigation';

interface OtherUserLayoutProps {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}

export default async function OtherUserLayout({ children, params }: OtherUserLayoutProps) {
  const { userId } = await params;
  const data = await getPublicProfileAction(userId);

  if (!data?.ok) {
    return notFound();
  }

  return (
    <Stack className="p-5 pt-5 h-full" gap="md">
      <Stack direction="horizontal" gap="regular" align="center">
        <Avatar src={data.data.avatar} size="lg" />
        <div>
          <Text as="h2">{data.data.username}</Text>
          {/* Aquí podríamos añadir el estado de amistad en el futuro */}
        </div>
      </Stack>
      {children}
    </Stack>
  );
}
