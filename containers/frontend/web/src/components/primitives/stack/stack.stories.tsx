/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from './stack';

const Box = ({ label }: { label: string }) => (
  <div className="rounded-md border border-border-primary bg-bg-secondary px-4 py-2 text-text-primary">
    {label}
  </div>
);

const meta = {
  title: 'Components/Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout primitive for vertical and horizontal flex composition. It centralizes direction, gap, alignment, justification, and semantic root element selection.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'nav', 'section', 'footer', 'header', 'article'],
      description: 'Semantic HTML element used as the root container.',
      table: {
        category: 'Semantics',
        type: {
          summary: "'div' | 'nav' | 'section' | 'footer' | 'header' | 'article'",
        },
        defaultValue: {
          summary: 'div',
        },
      },
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Stack direction.',
      table: {
        category: 'Layout',
        type: {
          summary: "'vertical' | 'horizontal'",
        },
        defaultValue: {
          summary: 'vertical',
        },
      },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'regular', 'md', 'lg'],
      description: 'Spacing between children.',
      table: {
        category: 'Layout',
        type: {
          summary: "'none' | 'xs' | 'sm' | 'regular' | 'md' | 'lg'",
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Cross-axis alignment.',
      table: {
        category: 'Layout',
        type: {
          summary: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
        },
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
      description: 'Main-axis distribution.',
      table: {
        category: 'Layout',
        type: {
          summary: "'start' | 'center' | 'end' | 'between'",
        },
        defaultValue: {
          summary: 'start',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the stack root styles.',
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
      description: 'Content rendered inside the stack.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
  },
  args: {
    as: 'div',
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <Stack {...args} className="w-full max-w-xs">
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    align: 'center',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
  ),
};

export const Gaps: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack gap="xs">
  <Box label="First" />
  <Box label="Second" />
</Stack>

<Stack gap="lg">
  <Box label="First" />
  <Box label="Second" />
</Stack>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-8">
      <Stack gap="xs" className="w-full max-w-xs">
        <Box label="gap: xs" />
        <Box label="Second" />
      </Stack>

      <Stack gap="sm" className="w-full max-w-xs">
        <Box label="gap: sm" />
        <Box label="Second" />
      </Stack>

      <Stack gap="md" className="w-full max-w-xs">
        <Box label="gap: md" />
        <Box label="Second" />
      </Stack>

      <Stack gap="lg" className="w-full max-w-xs">
        <Box label="gap: lg" />
        <Box label="Second" />
      </Stack>
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stack direction="horizontal" align="center" className="h-32">
  <Box label="First" />
  <Box label="Second" />
  <Box label="Third" />
</Stack>`,
      },
    },
  },
  render: () => (
    <Stack
      direction="horizontal"
      align="center"
      gap="sm"
      className="h-32 w-full max-w-md rounded-md border border-border-primary p-4"
    >
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
  ),
};

export const JustifyBetween: Story = {
  args: {
    direction: 'horizontal',
    justify: 'between',
    align: 'center',
  },
  render: (args) => (
    <Stack {...args} className="w-full max-w-md rounded-md border border-border-primary p-4">
      <Box label="Left" />
      <Box label="Center" />
      <Box label="Right" />
    </Stack>
  ),
};

export const SemanticSection: Story = {
  args: {
    as: 'section',
    gap: 'sm',
  },
  parameters: {
    docs: {
      source: {
        code: `<Stack as="section" gap="sm">
  <Box label="Section content" />
  <Box label="More content" />
</Stack>`,
      },
    },
  },
  render: (args) => (
    <Stack {...args} className="w-full max-w-xs">
      <Box label="Section content" />
      <Box label="More content" />
    </Stack>
  ),
};
