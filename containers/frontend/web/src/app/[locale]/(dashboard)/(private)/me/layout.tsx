import type { ReactNode } from 'react';

import { Stack, Avatar, Text, Breadcrumb } from '@components';
import { protectedMeProfileAction } from '@/features/profile/profile.action';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const data = await protectedMeProfileAction();
  console.log('ProtectedLayout data:', data);
  return (
    <Stack className="p-5 h-full" gap="md">
      <Breadcrumb />
      <Stack direction="horizontal" gap="rg" className="mt-2">
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
