/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NavigationClient } from './navigation.client';
import type { NavItem } from './navigation.config';

const mainNavItems = [
  {
    key: 'home',
    href: '/',
    icon: 'home',
    exact: true,
  },
  {
    key: 'profile',
    href: '/me',
    icon: 'user',
    exact: false,
  },
] satisfies NavItem[];

const meta = {
  title: 'Features/Navigation/NavigationClient',
  component: NavigationClient,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    docs: {
      description: {
        component:
          'Responsive application navigation. It renders a collapsible fixed sidebar on desktop and a drawer-based navigation on mobile.',
      },
    },
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'es'],
      description: 'Current locale used to build localized navigation links.',
      table: {
        category: 'Routing',
        type: { summary: 'string' },
      },
    },
    mainNavItems: {
      control: 'object',
      description: 'Main navigation items rendered in the navigation menu.',
      table: {
        category: 'Content',
        type: { summary: 'NavItem[]' },
      },
    },
    isAuthenticated: {
      control: 'boolean',
      description: 'Controls whether authenticated navigation entries are rendered.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
      },
    },
    mode: {
      control: 'select',
      options: ['auto', 'desktop', 'mobile'],
      description:
        'Forces the navigation variant. Use auto in the app, and desktop/mobile in Storybook.',
      table: {
        category: 'Storybook',
        type: { summary: "'auto' | 'desktop' | 'mobile'" },
        defaultValue: { summary: 'auto' },
      },
    },
    position: {
      control: 'select',
      options: ['fixed', 'absolute'],
      description:
        'Controls whether the navigation is fixed to the viewport or positioned inside a container.',
      table: {
        category: 'Storybook',
        type: { summary: "'fixed' | 'absolute'" },
        defaultValue: { summary: 'fixed' },
      },
    },
    showFooter: {
      control: 'boolean',
      description:
        'Controls whether the desktop navigation footer is rendered. Useful to disable auth/router-dependent footer content in Storybook.',
      table: {
        category: 'Storybook',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showSettings: {
      control: 'boolean',
      description:
        'Controls whether mobile settings content is rendered. Useful to disable app-specific settings in Storybook.',
      table: {
        category: 'Storybook',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    forceVisibleTrigger: {
      control: 'boolean',
      description:
        'Forces the mobile menu trigger to stay visible in Storybook, even when the iframe is wider than the mobile breakpoint.',
      table: {
        category: 'Storybook',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    locale: 'en',
    mainNavItems,
    isAuthenticated: true,
    mode: 'desktop',
    position: 'absolute',
    showFooter: false,
    showSettings: false,
    forceVisibleTrigger: false,
  },
} satisfies Meta<typeof NavigationClient>;

export default meta;

type Story = StoryObj<typeof meta>;

function NavigationStoryFrame({
  children,
  mobile = false,
}: {
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? 'relative min-h-[520px] w-[390px] overflow-hidden rounded-md border border-border-primary bg-bg-primary text-text-primary'
          : 'relative min-h-[520px] w-full overflow-hidden rounded-md border border-border-primary bg-bg-primary text-text-primary'
      }
    >
      {children}

      <main className={mobile ? 'p-6 pt-20' : 'ml-20 p-8'}>
        <div className="rounded-md border border-border-primary p-6">Story content area</div>
      </main>
    </div>
  );
}

export const Desktop: Story = {
  args: {
    mode: 'desktop',
    position: 'absolute',
    isAuthenticated: true,
    showFooter: false,
    showSettings: false,
  },
  render: (args) => (
    <NavigationStoryFrame>
      <NavigationClient {...args} />
    </NavigationStoryFrame>
  ),
  parameters: {
    docs: {
      source: {
        code: `<NavigationClient
  locale="en"
  isAuthenticated
  mode="desktop"
  position="absolute"
  showFooter={false}
  showSettings={false}
  mainNavItems={mainNavItems}
/>`,
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    mode: 'mobile',
    position: 'absolute',
    isAuthenticated: true,
    showFooter: false,
    showSettings: false,
    forceVisibleTrigger: true,
  },
  render: (args) => (
    <NavigationStoryFrame mobile>
      <NavigationClient {...args} />
    </NavigationStoryFrame>
  ),
  parameters: {
    docs: {
      source: {
        code: `<NavigationClient
  locale="en"
  isAuthenticated
  mode="mobile"
  position="absolute"
  showFooter={false}
  showSettings={false}
  forceVisibleTrigger
  mainNavItems={mainNavItems}
/>`,
      },
    },
  },
};

export const GuestDesktop: Story = {
  args: {
    mode: 'desktop',
    position: 'absolute',
    isAuthenticated: false,
    showFooter: false,
    showSettings: false,
  },
  render: (args) => (
    <NavigationStoryFrame>
      <NavigationClient {...args} />
    </NavigationStoryFrame>
  ),
};

export const GuestMobile: Story = {
  args: {
    mode: 'mobile',
    position: 'absolute',
    isAuthenticated: false,
    showFooter: false,
    showSettings: false,
    forceVisibleTrigger: true,
  },
  render: (args) => (
    <NavigationStoryFrame mobile>
      <NavigationClient {...args} />
    </NavigationStoryFrame>
  ),
};

export const EmptyNavigation: Story = {
  args: {
    mode: 'desktop',
    position: 'absolute',
    isAuthenticated: true,
    mainNavItems: [],
    showFooter: false,
    showSettings: false,
  },
  render: (args) => (
    <NavigationStoryFrame>
      <NavigationClient {...args} />
    </NavigationStoryFrame>
  ),
};
