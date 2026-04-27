import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AsyncCooldownButton } from './async-cooldown-button';

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const meta = {
  title: 'Components/Composites/AsyncCooldownButton',
  component: AsyncCooldownButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button that runs an async action, disables itself while pending, and starts a cooldown before it can be pressed again.',
      },
    },
  },
  argTypes: {
    onPress: {
      action: 'pressed',
      description: 'Callback fired when the button is pressed. Can be synchronous or asynchronous.',
      table: {
        category: 'Events',
        type: {
          summary: '() => void | Promise<void>',
        },
      },
    },
    cooldownSeconds: {
      control: {
        type: 'number',
        min: 1,
        max: 120,
        step: 1,
      },
      description: 'Cooldown duration in seconds after the button is pressed.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '30',
        },
      },
    },
    startOnMount: {
      control: 'boolean',
      description: 'Starts the cooldown as soon as the component is mounted.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    idleLabel: {
      control: 'text',
      description: 'Text shown when the button is idle and available.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    pendingLabel: {
      control: 'text',
      description: 'Text shown while the async action is running.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    formatCooldownLabel: {
      control: false,
      description: 'Optional formatter for the cooldown text.',
      table: {
        category: 'Content',
        type: {
          summary: '(remaining: number) => string',
        },
      },
    },
  },
  args: {
    idleLabel: 'Resend email',
    pendingLabel: 'Sending...',
    cooldownSeconds: 5,
    startOnMount: false,
    onPress: async () => {
      await wait(1000);
    },
  },
} satisfies Meta<typeof AsyncCooldownButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartsOnMount: Story = {
  args: {
    startOnMount: true,
    cooldownSeconds: 10,
    idleLabel: 'Resend email',
    pendingLabel: 'Sending...',
  },
};

export const CustomCooldownLabel: Story = {
  args: {
    cooldownSeconds: 10,
    idleLabel: 'Try again',
    pendingLabel: 'Submitting...',
    formatCooldownLabel: (remaining) => `Available again in ${remaining}s`,
  },
  parameters: {
    docs: {
      source: {
        code: `<AsyncCooldownButton
  idleLabel="Try again"
  pendingLabel="Submitting..."
  cooldownSeconds={10}
  formatCooldownLabel={(remaining) => \`Available again in \${remaining}s\`}
  onPress={async () => {
    await submitAction();
  }}
/>`,
      },
    },
  },
};

export const SlowAsyncAction: Story = {
  args: {
    cooldownSeconds: 8,
    idleLabel: 'Submit',
    pendingLabel: 'Submitting...',
    onPress: async () => {
      await wait(2500);
    },
  },
};

export const Examples: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-4">
  <AsyncCooldownButton
    idleLabel="Resend email"
    pendingLabel="Sending..."
    cooldownSeconds={5}
    onPress={async () => {
      await resendEmail();
    }}
  />

  <AsyncCooldownButton
    idleLabel="Verify again"
    pendingLabel="Checking..."
    cooldownSeconds={10}
    startOnMount
    onPress={async () => {
      await verifyEmail();
    }}
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <AsyncCooldownButton
        idleLabel="Resend email"
        pendingLabel="Sending..."
        cooldownSeconds={5}
        onPress={async () => {
          await wait(1000);
        }}
      />

      <AsyncCooldownButton
        idleLabel="Verify again"
        pendingLabel="Checking..."
        cooldownSeconds={10}
        startOnMount
        onPress={async () => {
          await wait(1000);
        }}
      />
    </div>
  ),
};
