/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ContentSection } from './content-section';

const meta = {
  title: 'Components/Composites/ContentSection',
  component: ContentSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable content section for structured text blocks. It can render a title, description, optional list items, and custom children inside a Stack layout.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional section title rendered as an h2.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    description: {
      control: 'text',
      description: 'Optional supporting description rendered as a paragraph.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    items: {
      control: 'object',
      description: 'Optional list of items rendered as a bullet list.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode[]',
        },
      },
    },
    children: {
      control: false,
      description: 'Optional custom content rendered after title, description, and list items.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    as: {
      control: 'select',
      options: ['section', 'article', 'header', 'div'],
      description: 'HTML element used for the root Stack container.',
      table: {
        category: 'Semantics',
        type: {
          summary: "'section' | 'article' | 'header' | 'div'",
        },
        defaultValue: {
          summary: 'section',
        },
      },
    },
  },
  args: {
    as: 'section',
    title: 'Account security',
    description:
      'Keep your account protected by using a strong password and reviewing active sessions regularly.',
    items: [
      'Use a unique password.',
      'Do not share your credentials.',
      'Review suspicious activity.',
    ],
  },
} satisfies Meta<typeof ContentSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: {
    title: 'Profile',
    description: undefined,
    items: undefined,
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Privacy settings',
    description: 'Control who can see your profile, game status, and social activity.',
    items: undefined,
  },
};

export const WithItems: Story = {
  args: {
    title: 'Before you continue',
    description: undefined,
    items: ['Check your email address.', 'Confirm your username.', 'Accept the terms.'],
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Custom content',
    description: 'Children are rendered after the standard content blocks.',
    items: undefined,
    children: (
      <div className="rounded-md border border-border-primary p-4 text-text-secondary">
        This is custom child content.
      </div>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<ContentSection
  title="Custom content"
  description="Children are rendered after the standard content blocks."
>
  <div className="rounded-md border border-border-primary p-4 text-text-secondary">
    This is custom child content.
  </div>
</ContentSection>`,
      },
    },
  },
};

export const ArticleSemanticElement: Story = {
  args: {
    as: 'article',
    title: 'Article section',
    description: 'Use the as prop to change the semantic root element.',
    items: ['Rendered as article.', 'Keeps the same visual layout.'],
  },
  parameters: {
    docs: {
      source: {
        code: `<ContentSection
  as="article"
  title="Article section"
  description="Use the as prop to change the semantic root element."
  items={['Rendered as article.', 'Keeps the same visual layout.']}
/>`,
      },
    },
  },
};
