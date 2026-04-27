/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Disclosure, DisclosureGroup, DisclosurePanel, DisclosureTrigger } from './disclosure';

const meta = {
  title: 'Components/Controls/Disclosure',
  component: Disclosure,
  subcomponents: {
    DisclosureGroup,
    DisclosureTrigger,
    DisclosurePanel,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible disclosure components built on React Aria Components. Use Disclosure for a single expandable section, DisclosureGroup for grouped sections, DisclosureTrigger for the clickable header, and DisclosurePanel for the expandable content.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the disclosure item.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'string',
        },
      },
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the disclosure is expanded by default when uncontrolled.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    isExpanded: {
      control: 'boolean',
      description: 'Controls the expanded state when using the component as controlled.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
      },
    },
    onExpandedChange: {
      action: 'expanded changed',
      description: 'Callback fired when the expanded state changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(isExpanded: boolean) => void',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className passed to the disclosure container.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        disable: true,
      },
    },
    children: {
      control: false,
      description:
        'Disclosure content. Can be React nodes or a render function supported by React Aria Components.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode | ((values) => ReactNode)',
        },
        disable: true,
      },
    },
  },
  args: {
    id: 'account-settings',
    defaultExpanded: false,
  },
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Disclosure id="account-settings">
  <DisclosureTrigger title="Account settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Manage your account profile, email, and password settings.
    </div>
  </DisclosurePanel>
</Disclosure>`,
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Disclosure {...args}>
        <DisclosureTrigger title="Account settings" />
        <DisclosurePanel>
          <div className="py-3 text-text-secondary">
            Manage your account profile, email, and password settings.
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  ),
};

export const ExpandedByDefault: Story = {
  args: {
    defaultExpanded: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Disclosure id="privacy-settings" defaultExpanded>
  <DisclosureTrigger title="Privacy settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Control profile visibility, blocked users, and account privacy.
    </div>
  </DisclosurePanel>
</Disclosure>`,
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Disclosure {...args} id="privacy-settings">
        <DisclosureTrigger title="Privacy settings" />
        <DisclosurePanel>
          <div className="py-3 text-text-secondary">
            Control profile visibility, blocked users, and account privacy.
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  ),
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use DisclosureGroup to render a list of related expandable sections.',
      },
      source: {
        code: `<DisclosureGroup>
  <Disclosure id="profile">
    <DisclosureTrigger title="Profile" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Update your public profile information.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="security">
    <DisclosureTrigger title="Security" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Manage password, sessions, and account security.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="notifications">
    <DisclosureTrigger title="Notifications" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Configure email and in-app notification preferences.
      </div>
    </DisclosurePanel>
  </Disclosure>
</DisclosureGroup>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <DisclosureGroup>
        <Disclosure id="profile">
          <DisclosureTrigger title="Profile" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">Update your public profile information.</div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="security">
          <DisclosureTrigger title="Security" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">
              Manage password, sessions, and account security.
            </div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="notifications">
          <DisclosureTrigger title="Notifications" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">
              Configure email and in-app notification preferences.
            </div>
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>
    </div>
  ),
};

export const WithCustomPanelContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'DisclosurePanel accepts any React content, so it can be used for text, links, actions, or structured layouts.',
      },
      source: {
        code: `<Disclosure id="danger-zone">
  <DisclosureTrigger title="Danger zone" />
  <DisclosurePanel>
    <div className="grid gap-3 py-3">
      <p className="text-text-secondary">
        These actions can affect your account permanently.
      </p>
      <button type="button" className="text-left text-red-600">
        Delete account
      </button>
    </div>
  </DisclosurePanel>
</Disclosure>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Disclosure id="danger-zone">
        <DisclosureTrigger title="Danger zone" />
        <DisclosurePanel>
          <div className="grid gap-3 py-3">
            <p className="text-text-secondary">
              These actions can affect your account permanently.
            </p>
            <button type="button" className="text-left text-red-600">
              Delete account
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  ),
};
