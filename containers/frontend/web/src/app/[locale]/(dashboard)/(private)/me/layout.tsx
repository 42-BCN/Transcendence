import type { ReactNode } from 'react';

import { Stack, Avatar, Text, Breadcrumb } from '@components';
import { protectedMeProfileAction } from '@/features/profile/profile.action';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const data = await protectedMeProfileAction();
  if (!data.ok) {
    return <div>Failed to load profile data</div>;
  }
  return (
    <Stack className="p-5 pt-3 h-full" gap="md">
      <Breadcrumb />
      <Stack direction="horizontal" gap="rg" align="center">
        <Avatar src="" size="lg" />
        <div>
          <Text as="h2">{data.data.username}</Text>
          <Text variant="body-sm" className="text-text-secondary">
            {data.data.email || 'No email available'}
          </Text>
        </div>
      </Stack>
      {children}
    </Stack>
  );
}
