/* eslint-disable local/no-literal-ui-strings */
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@components/controls/button';
import { IconButton } from '../icon-button/icon-button';

import { TooltipLink, TooltipTrigger } from './tooltip-trigger';
import type { TooltipTriggerProps } from './tooltip-trigger';

type TooltipTriggerStoryProps = Omit<TooltipTriggerProps, 'children'> & {
  children?: ReactNode;
};

function TooltipTriggerStory(props: TooltipTriggerStoryProps) {
  const { children, ...tooltipProps } = props;

  return (
    <TooltipTrigger {...tooltipProps}>
      {children ?? <Button w="auto">Hover or focus me</Button>}
    </TooltipTrigger>
  );
}

const meta = {
  title: 'Components/Composites/TooltipTrigger',
  component: TooltipTriggerStory,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip trigger composition built on React Aria Components. It wraps an interactive child and renders a project Tooltip with configurable placement and offset.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Interactive element that triggers the tooltip. Usually a Button, IconButton, or Link.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    label: {
      control: 'text',
      description: 'Tooltip text content.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Tooltip placement relative to the trigger.',
      table: {
        category: 'Position',
        type: {
          summary: "'left' | 'right' | 'top' | 'bottom'",
        },
        defaultValue: {
          summary: 'right',
        },
      },
    },
    offset: {
      control: {
        type: 'number',
        min: 0,
        max: 32,
        step: 1,
      },
      description: 'Distance in pixels between the trigger and the tooltip.',
      table: {
        category: 'Position',
        type: {
          summary: 'number',
        },
      },
    },
  },
  args: {
    label: 'Tooltip content',
    placement: 'right',
    offset: 8,
  },
} satisfies Meta<typeof TooltipTriggerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithButton: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TooltipTrigger label="Tooltip content" placement="right" offset={8}>
  <Button w="auto">Hover or focus me</Button>
</TooltipTrigger>`,
      },
    },
  },
};

export const WithIconButton: Story = {
  args: {
    label: 'Open settings',
    placement: 'top',
    offset: 8,
    children: <IconButton label="Settings" icon="settings" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<TooltipTrigger label="Open settings" placement="top" offset={8}>
  <IconButton label="Settings" icon="settings" />
</TooltipTrigger>`,
      },
    },
  },
};

export const Placements: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid grid-cols-2 gap-8">
  <TooltipTrigger label="Top tooltip" placement="top">
    <Button w="auto">Top</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Right tooltip" placement="right">
    <Button w="auto">Right</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Bottom tooltip" placement="bottom">
    <Button w="auto">Bottom</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Left tooltip" placement="left">
    <Button w="auto">Left</Button>
  </TooltipTrigger>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-12">
      <TooltipTrigger label="Top tooltip" placement="top">
        <Button w="auto">Top</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Right tooltip" placement="right">
        <Button w="auto">Right</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Bottom tooltip" placement="bottom">
        <Button w="auto">Bottom</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Left tooltip" placement="left">
        <Button w="auto">Left</Button>
      </TooltipTrigger>
    </div>
  ),
};

export const Link: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'TooltipLink composes InternalLink with TooltipTrigger for link-specific tooltip usage.',
      },
      source: {
        code: `<TooltipLink href="/settings" label="Go to settings">
  Settings
</TooltipLink>`,
      },
    },
  },
  render: () => (
    <TooltipLink href="/me" label="Go to settings" placement="left">
      Settings
    </TooltipLink>
  ),
};
