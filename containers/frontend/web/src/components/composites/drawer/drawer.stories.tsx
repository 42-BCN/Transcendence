/* eslint-disable local/no-literal-ui-strings */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@components/controls/button';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

import { Drawer } from './drawer';

const meta = {
  title: 'Components/Composites/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Drawer overlay built on React Aria Components ModalOverlay, Modal, and Dialog. It is intended for full-height side-panel content.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'Content rendered inside the drawer dialog.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode | RenderProps',
        },
      },
    },
    isOpen: {
      control: false,
      description: 'Controls whether the drawer is open.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
      },
    },
    isDismissable: {
      control: 'boolean',
      description: 'Allows the drawer to be dismissed by interacting outside of it.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'boolean',
        },
      },
    },
    isKeyboardDismissDisabled: {
      control: 'boolean',
      description: 'Prevents the drawer from being dismissed with the Escape key.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'boolean',
        },
      },
    },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the drawer open state changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(isOpen: boolean) => void',
        },
      },
    },
  },
  args: {
    isDismissable: true,
    isKeyboardDismissDisabled: false,
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

type DrawerContentProps = {
  onClose?: () => void;
};

function DrawerContent({ onClose }: DrawerContentProps) {
  return (
    <div className="h-full w-[320px] bg-bg-primary p-6 text-text-primary shadow-lg">
      <Stack gap="md">
        <Text as="h2" variant="heading-sm">
          Drawer title
        </Text>

        <Text variant="body" color="secondary">
          This is drawer content. Use it for navigation, filters, settings, or secondary flows.
        </Text>

        <Button w="full" variant="primary">
          Primary action
        </Button>

        <Button w="full" variant="secondary" onPress={onClose}>
          Close drawer
        </Button>
      </Stack>
    </div>
  );
}

function ControlledDrawer(args: React.ComponentProps<typeof Drawer>) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-[240px]">
      <Button w="auto" onPress={() => setIsOpen(true)}>
        Open drawer
      </Button>

      <Drawer {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent onClose={closeDrawer} />
      </Drawer>
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onPress={() => setIsOpen(true)}>
      Open drawer
    </Button>

    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDismissable
    >
      <DrawerContent />
    </Drawer>
  </>
);`,
      },
    },
  },
  render: (args) => <ControlledDrawer {...args} />,
};

export const NonDismissable: Story = {
  args: {
    isDismissable: false,
    isKeyboardDismissDisabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  isDismissable={false}
  isKeyboardDismissDisabled
>
  <DrawerContent />
</Drawer>`,
      },
    },
  },
  render: (args) => <ControlledDrawer {...args} />,
};
