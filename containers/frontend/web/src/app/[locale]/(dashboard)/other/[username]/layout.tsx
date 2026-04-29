import type { ReactNode } from 'react';
import { Stack, Avatar, Text } from '@components';
import { getPublicProfileAction } from '@/features/profile/profile.action';
import { notFound } from 'next/navigation';

interface OtherUserLayoutProps {
  children: ReactNode;
  params: Promise<{ username: string }>;
}

export default async function OtherUserLayout({ children, params }: OtherUserLayoutProps) {
  const { username } = await params;
  const data = await getPublicProfileAction(username);

  if (!data?.ok) {
    return notFound();
  }

  return (
    <Stack className="p-5 pt-5 h-full" gap="md">
      <Stack direction="horizontal" gap="regular" align="center">
        <Avatar src={data.data.avatar} size="lg" />
        <Text as="h2">{data.data.username}</Text>
      </Stack>
      {children}
    </Stack>
  );
}
