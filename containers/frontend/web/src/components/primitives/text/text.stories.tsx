/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Text } from './text';

const textVariants = [
  'divider',
  'caption',
  'body-xs',
  'body-sm',
  'body',
  'body-lg',
  'heading-sm',
  'heading-md',
  'heading-lg',
  'heading-xl',
  'code',
] as const;

const textColors = [
  'primary',
  'secondary',
  'tertiary',
  'disabled',
  'inverse',
  'info',
  'danger',
  'success',
  'muted',
] as const;

const meta = {
  title: 'Components/Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Typography primitive that maps semantic HTML tags, project text variants, and design-token text colors.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: [
        'span',
        'p',
        'strong',
        'em',
        'small',
        'code',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'div',
      ],
      description: 'HTML element rendered by the Text component.',
      table: {
        category: 'Semantics',
        type: {
          summary:
            "'span' | 'p' | 'strong' | 'em' | 'small' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'",
        },
        defaultValue: {
          summary: 'span',
        },
      },
    },
    variant: {
      control: 'select',
      options: textVariants,
      description: 'Typography style variant.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'TextVariant',
        },
        defaultValue: {
          summary: 'body',
        },
      },
    },
    color: {
      control: 'select',
      options: textColors,
      description: 'Text color token.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'TextColor',
        },
        defaultValue: {
          summary: 'primary',
        },
      },
    },
    children: {
      control: 'text',
      description: 'Text content.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged with the generated text styles.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        disable: true,
      },
    },
  },
  args: {
    as: 'p',
    variant: 'body',
    color: 'primary',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-3">
  <Text variant="heading-xl">Heading XL</Text>
  <Text variant="heading-lg">Heading LG</Text>
  <Text variant="heading-md">Heading MD</Text>
  <Text variant="heading-sm">Heading SM</Text>
  <Text variant="body-lg">Body LG</Text>
  <Text variant="body">Body</Text>
  <Text variant="body-sm">Body SM</Text>
  <Text variant="body-xs">Body XS</Text>
  <Text variant="caption">Caption</Text>
  <Text variant="code">const value = true;</Text>
  <Text variant="divider">or</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-3">
      <Text variant="heading-xl">Heading XL</Text>
      <Text variant="heading-lg">Heading LG</Text>
      <Text variant="heading-md">Heading MD</Text>
      <Text variant="heading-sm">Heading SM</Text>
      <Text variant="body-lg">Body LG</Text>
      <Text variant="body">Body</Text>
      <Text variant="body-sm">Body SM</Text>
      <Text variant="body-xs">Body XS</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="code">const value = true;</Text>
      <Text variant="divider">or</Text>
    </div>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-2">
  <Text color="primary">Primary text</Text>
  <Text color="secondary">Secondary text</Text>
  <Text color="tertiary">Tertiary text</Text>
  <Text color="disabled">Disabled text</Text>
  <Text color="info">Info text</Text>
  <Text color="danger">Danger text</Text>
  <Text color="success">Success text</Text>
  <Text color="muted">Muted text</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-2">
      <Text color="primary">Primary text</Text>
      <Text color="secondary">Secondary text</Text>
      <Text color="tertiary">Tertiary text</Text>
      <Text color="disabled">Disabled text</Text>
      <Text color="info">Info text</Text>
      <Text color="danger">Danger text</Text>
      <Text color="success">Success text</Text>
      <Text color="muted">Muted text</Text>
    </div>
  ),
};

export const Headings: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-3">
  <Text as="h1" variant="heading-xl">Page title</Text>
  <Text as="h2" variant="heading-lg">Section title</Text>
  <Text as="h3" variant="heading-md">Subsection title</Text>
  <Text as="h4" variant="heading-sm">Group title</Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-3">
      <Text as="h1" variant="heading-xl">
        Page title
      </Text>
      <Text as="h2" variant="heading-lg">
        Section title
      </Text>
      <Text as="h3" variant="heading-md">
        Subsection title
      </Text>
      <Text as="h4" variant="heading-sm">
        Group title
      </Text>
    </div>
  ),
};

export const BodyCopy: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid max-w-md gap-3">
  <Text as="p" variant="body">
    This is regular body copy for common page content.
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This is supporting body copy with secondary color.
  </Text>

  <Text as="small" variant="caption" color="tertiary">
    This is caption text for metadata or helper copy.
  </Text>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid max-w-md gap-3">
      <Text as="p" variant="body">
        This is regular body copy for common page content.
      </Text>

      <Text as="p" variant="body-sm" color="secondary">
        This is supporting body copy with secondary color.
      </Text>

      <Text as="small" variant="caption" color="tertiary">
        This is caption text for metadata or helper copy.
      </Text>
    </div>
  ),
};

export const Divider: Story = {
  args: {
    as: 'span',
    variant: 'divider',
    color: 'disabled',
    children: 'or',
  },
  parameters: {
    docs: {
      source: {
        code: `<Text as="span" variant="divider" color="disabled">
  or
</Text>`,
      },
    },
  },
};
