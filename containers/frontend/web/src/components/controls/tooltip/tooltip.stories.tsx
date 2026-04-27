/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TooltipTrigger as AriaTooltipTrigger } from 'react-aria-components';

import { Button } from '@components/controls/button';
import { IconButton } from '../../composites/icon-button/icon-button';

import { Tooltip } from './tooltip';

const meta = {
  title: 'Components/Controls/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tooltip built on React Aria Components. It renders an overlay arrow and project tooltip styles. Use it inside TooltipTrigger.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Tooltip content.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip placement relative to the trigger.',
      table: {
        category: 'Position',
        type: {
          summary: "'top' | 'bottom' | 'left' | 'right'",
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
      description:
        'Distance between the tooltip and trigger. Note: the current component overrides this internally with offset={14}.',
      table: {
        category: 'Position',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '14',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className composed with the tooltip styles.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string | ((values) => string)',
        },
        disable: true,
      },
    },
  },
  args: {
    children: 'Tooltip content',
    placement: 'top',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TooltipTrigger>
  <Button w="auto">Hover or focus me</Button>
  <Tooltip placement="top">Tooltip content</Tooltip>
</TooltipTrigger>`,
      },
    },
  },
  render: (args) => (
    <div className="p-12">
      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Hover or focus me</Button>
        <Tooltip {...args} />
      </AriaTooltipTrigger>
    </div>
  ),
};

export const WithIconButton: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TooltipTrigger>
  <IconButton label="Settings" icon="settings" />
  <Tooltip placement="top">Open settings</Tooltip>
</TooltipTrigger>`,
      },
    },
  },
  render: () => (
    <div className="p-12">
      <AriaTooltipTrigger delay={0}>
        <IconButton label="Settings" icon="settings" />
        <Tooltip placement="top">Open settings</Tooltip>
      </AriaTooltipTrigger>
    </div>
  ),
};

export const Placements: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid grid-cols-2 gap-10 p-12">
  <TooltipTrigger>
    <Button w="auto">Top</Button>
    <Tooltip placement="top">Top tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Right</Button>
    <Tooltip placement="right">Right tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Bottom</Button>
    <Tooltip placement="bottom">Bottom tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Left</Button>
    <Tooltip placement="left">Left tooltip</Tooltip>
  </TooltipTrigger>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-10 p-12">
      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Top</Button>
        <Tooltip placement="top">Top tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Right</Button>
        <Tooltip placement="right">Right tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Bottom</Button>
        <Tooltip placement="bottom">Bottom tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Left</Button>
        <Tooltip placement="left">Left tooltip</Tooltip>
      </AriaTooltipTrigger>
    </div>
  ),
};
