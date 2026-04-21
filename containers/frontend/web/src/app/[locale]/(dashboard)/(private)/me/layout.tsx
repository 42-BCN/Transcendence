import type { ReactNode } from 'react';

import { Stack, Avatar, Text, Breadcrumb } from '@components';
import { protectedMeProfileAction } from '@/features/profile/profile.action';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const data = await protectedMeProfileAction();

  return (
    <Stack className="p-5">
      <Breadcrumb />
      <Stack direction="horizontal" gap="sm">
        <Avatar src="" size="lg" />
        <div>
          <Text as="h2">{data.data.username}</Text>
          <Text variant="body-sm" className="text-text-secondary">
            email
          </Text>
        </div>
      </Stack>
      {children}
    </Stack>
  );
}
