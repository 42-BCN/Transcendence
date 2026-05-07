import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Avatar, Breadcrumb, Stack, Text } from '@components';

import { getPublicProfileAction } from './profile.action';
import { PublicProfileClient } from './public-profile.client';

interface PublicProfileProps {
  username: string;
}

export async function PublicProfile({ username }: PublicProfileProps) {
  const [tProfile, tBreadcrumb] = await Promise.all([
    getTranslations('features.profile'),
    getTranslations('components.breadcrumb'),
  ]);
  const data = await getPublicProfileAction(username);

  if (!data?.ok) {
    return notFound();
  }

  return (
    <Stack className="p-5 pt-3 h-full" gap="md">
      <Breadcrumb
        items={[
          { label: tBreadcrumb('home'), href: '/' },
          { label: data.data.username, href: `/other/${username}` },
        ]}
      />
      <Stack direction="horizontal" gap="regular" align="center">
        <Avatar src={data.data.avatar} size="lg" />
        <Text as="h2">{data.data.username}</Text>
      </Stack>
      <PublicProfileClient userId={data.data.id} bio={data.data.bio} />
    </Stack>
  );
}
