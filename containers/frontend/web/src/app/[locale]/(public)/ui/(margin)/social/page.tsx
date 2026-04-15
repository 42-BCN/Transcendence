'use client';

import {
  Avatar,
  UserItem,
  Stack,
  Text,
  Button,
  Tooltip,
  TooltipTrigger,
  Icon,
  InternalLink,
} from '@components';

export default function SocialTestPage() {
  return (
    <Stack gap="lg" className="max-w-md">
      <Stack gap="xs">
        <Text as="h1" variant="heading-md">
          Social Components Test
        </Text>
        <Text color="secondary">Testing Avatar primitives and UserItem composites.</Text>
      </Stack>

      {/* --- AVATAR SECTION --- */}
      <Stack gap="md">
        <Text variant="heading-sm">1. Avatar Sizes & Fallbacks</Text>
        <Stack direction="horizontal" align="center" gap="md">
          <Stack align="center" gap="xs">
            <Avatar size="sm" src="/avatars/avatar-1.png" />
            <Text variant="caption">Small</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="md" src="/avatars/avatar-2.png" />
            <Text variant="caption">Medium</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="lg" src="/avatars/avatar-3.png" />
            <Text variant="caption">Large</Text>
          </Stack>
          <Stack align="center" gap="xs">
            <Avatar size="md" src={null} />
            <Text variant="caption">Fallback</Text>
          </Stack>
        </Stack>
      </Stack>

      {/* --- USERITEM SECTION --- */}
      <Stack gap="md">
        <Text variant="heading-sm">2. UserItem Variants</Text>

        <Stack gap="sm" className="rounded-xl border border-border-primary p-4 bg-bg-primary/50">
          <Text variant="caption" color="muted" className="mb-2">
            Social List Examples
          </Text>

          {/* Example 1: Standard Friend */}
          <UserItem
            username="user_dev"
            subtitle="Online"
            avatarUrl="/avatars/avatar-4.png"
            actions={
              <>
                <TooltipTrigger label="Play Game" placement="top">
                  <Button variant="primary" size="sm" className="p-2">
                    <Icon name="gamepad" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipTrigger label="Send Message" placement="top">
                  <InternalLink href="#" as="button" variant="primary" size="sm" className="p-2">
                    <Icon name="messages" className="h-4 w-4" />
                  </InternalLink>
                </TooltipTrigger>
              </>
            }
          />

          <div className="h-px bg-border-primary w-full" />

          {/* Example 2: Friend Request */}
          <UserItem
            username="user_42"
            subtitle="Sent 2 days ago"
            avatarUrl="/avatars/avatar-2.png"
            actions={
              <>
                <TooltipTrigger label="Reject Request" placement="top">
                  <Button variant="secondary" size="sm" className="p-2">
                    <Icon name="close" className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipTrigger label="Accept Request" placement="top">
                  <Button variant="primary" size="sm" className="p-2">
                    <Icon name="check" className="h-4 w-4 text-green-500" />
                  </Button>
                </TooltipTrigger>
              </>
            }
          />

          <div className="h-px bg-border-primary w-full" />

          {/* Example 3: Search Result */}
          <UserItem
            username="user_designer"
            avatarUrl="/avatars/avatar-1.png"
            actions={
              <TooltipTrigger label="Add Friend" placement="top">
                <Button variant="primary" size="sm" className="p-2">
                  <Icon name="userAdd" className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
