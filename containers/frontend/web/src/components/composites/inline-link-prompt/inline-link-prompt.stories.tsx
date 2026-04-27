import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InlineLinkPrompt } from './inline-link-prompt';

const meta = {
  title: 'Components/Composites/InlineLinkPrompt',
  component: InlineLinkPrompt,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline prompt composed from Text, Stack, and InternalLink. Useful for short authentication or navigation prompts such as sign-in/sign-up links.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Text displayed before the inline link.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    linkLabel: {
      control: 'text',
      description: 'Visible label for the inline link.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    href: {
      control: 'text',
      description: 'Internal route passed to the InternalLink component.',
      table: {
        category: 'Navigation',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    text: 'Already have an account?',
    linkLabel: 'Sign in',
    href: '/login',
  },
} satisfies Meta<typeof InlineLinkPrompt>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SignUpPrompt: Story = {
  args: {
    text: "Don't have an account?",
    linkLabel: 'Create account',
    href: '/login',
  },
  parameters: {
    docs: {
      source: {
        code: `<InlineLinkPrompt
  text="Don't have an account?"
  linkLabel="Create account"
  href="/signup"
/>`,
      },
    },
  },
};

export const ForgotPasswordPrompt: Story = {
  args: {
    text: 'Forgot your password?',
    linkLabel: 'Reset it',
    href: '/reset-password',
  },
  parameters: {
    docs: {
      source: {
        code: `<InlineLinkPrompt
  text="Forgot your password?"
  linkLabel="Reset it"
  href="/forgot-password"
/>`,
      },
    },
  },
};
