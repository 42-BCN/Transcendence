/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DisclosureFull } from './disclosure-full';

const meta = {
  title: 'Components/Composites/DisclosureFull',
  component: DisclosureFull,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Composed disclosure component that combines Disclosure, DisclosureTrigger, and DisclosurePanel into a simpler API for common expandable content sections.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier passed to the underlying Disclosure.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'string',
        },
      },
    },
    title: {
      control: 'text',
      description: 'Text shown in the disclosure trigger.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    children: {
      control: false,
      description: 'Content rendered inside the disclosure panel.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
  },
  args: {
    id: 'faq-account',
    title: 'How do I update my account?',
    children: (
      <div className="py-3 text-text-secondary">
        Open your profile settings and update the fields you want to change.
      </div>
    ),
  },
} satisfies Meta<typeof DisclosureFull>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FAQ: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DisclosureFull id="faq-account" title="How do I update my account?">
  <div className="py-3 text-text-secondary">
    Open your profile settings and update the fields you want to change.
  </div>
</DisclosureFull>`,
      },
    },
  },
  args: {
    id: 'faq-account',
    title: 'How do I update my account?',
    children: (
      <div className="py-3 text-text-secondary">
        Open your profile settings and update the fields you want to change.
      </div>
    ),
  },
};
