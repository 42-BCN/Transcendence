/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Text } from '@components/primitives/text';

import { GlassCard } from './glass-card';

const meta = {
  title: 'Components/Primitives/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Glass-style surface primitive. It applies backdrop blur, translucent gradient intensity, border intensity, shadow, radius, padding, and optional backdrop saturation.',
      },
    },
  },
  argTypes: {
    blur: {
      control: 'select',
      options: ['none', 'sm', 'sm2', 'md', 'lg', 'xl', '2xl'],
      description: 'Controls the backdrop blur strength.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'none' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl' | '2xl'",
        },
        defaultValue: {
          summary: 'sm2',
        },
      },
    },
    intensity: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Controls the translucent glass background intensity.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'low' | 'medium' | 'high'",
        },
        defaultValue: {
          summary: 'medium',
        },
      },
    },
    borderIntensity: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Controls the glass border intensity.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'low' | 'medium' | 'high'",
        },
        defaultValue: {
          summary: 'medium',
        },
      },
    },
    saturate: {
      control: 'boolean',
      description: 'Enables or disables backdrop saturation.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'true',
        },
      },
    },
    children: {
      control: false,
      description: 'Content rendered inside the card.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the glass card styles.',
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
    blur: 'sm2',
    intensity: 'medium',
    borderIntensity: 'medium',
    saturate: true,
  },
} satisfies Meta<typeof GlassCard>;

export default meta;

type Story = StoryObj<typeof meta>;

function CardContent() {
  return (
    <div className="grid gap-2">
      <Text as="h3" variant="heading-sm">
        Glass card
      </Text>

      <Text as="p" variant="body-sm" color="secondary">
        This surface is useful for panels, navigation containers, overlays, and floating UI.
      </Text>
    </div>
  );
}
function DemoBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[420px] w-full max-w-md overflow-hidden rounded-md border border-border-primary bg-bg-primary p-8">
      <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-500" aria-hidden="true" />

      <div className="absolute inset-y-0 left-1/3 w-1/3 bg-white" aria-hidden="true" />

      <div
        className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-purple-500 to-transparent"
        aria-hidden="true"
      />

      <div
        className="absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] bg-[size:18px_18px] opacity-80"
        aria-hidden="true"
      />

      <div className="absolute left-0 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-white/70">
        Solid
      </div>

      <div className="absolute left-1/3 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-slate-500">
        Empty
      </div>

      <div className="absolute right-0 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-white/70">
        Fade
      </div>

      <div className="relative z-10 pt-10">{children}</div>
    </div>
  );
}
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<GlassCard>
  <Text as="h3" variant="heading-sm">
    Glass card
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This surface is useful for panels, navigation containers, overlays, and floating UI.
  </Text>
</GlassCard>`,
      },
    },
  },
  render: (args) => (
    <DemoBackground>
      <GlassCard {...args}>
        <CardContent />
      </GlassCard>
    </DemoBackground>
  ),
};

export const Intensities: Story = {
  render: () => (
    <DemoBackground>
      <div className="grid gap-4">
        <GlassCard intensity="low" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">Low</Text>
          <Text variant="body-sm" color="secondary">
            More transparent
          </Text>
        </GlassCard>

        <GlassCard intensity="medium" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">Medium</Text>
          <Text variant="body-sm" color="secondary">
            Default balance
          </Text>
        </GlassCard>

        <GlassCard intensity="high" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">High</Text>
          <Text variant="body-sm" color="secondary">
            More visible surface
          </Text>
        </GlassCard>
      </div>
    </DemoBackground>
  ),
};

export const BlurLevels: Story = {
  render: () => (
    <DemoBackground>
      <div className="grid gap-4">
        <GlassCard blur="none" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">None</Text>
        </GlassCard>

        <GlassCard blur="sm" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">SM</Text>
        </GlassCard>

        <GlassCard blur="sm2" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">SM2</Text>
        </GlassCard>

        <GlassCard blur="md" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">MD</Text>
        </GlassCard>

        <GlassCard blur="lg" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">LG</Text>
        </GlassCard>

        <GlassCard blur="xl" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">XL</Text>
        </GlassCard>

        <GlassCard blur="2xl" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">2XL</Text>
        </GlassCard>
      </div>
    </DemoBackground>
  ),
};

export const Borders: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-4">
  <GlassCard borderIntensity="low">
    Low border
  </GlassCard>

  <GlassCard borderIntensity="medium">
    Medium border
  </GlassCard>

  <GlassCard borderIntensity="high">
    High border
  </GlassCard>
</div>`,
      },
    },
  },
  render: () => (
    <DemoBackground>
      <div className="grid gap-4">
        <GlassCard borderIntensity="low" className="w-full p-4">
          <Text variant="body-sm">Low border</Text>
        </GlassCard>

        <GlassCard borderIntensity="medium" className="w-full p-4">
          <Text variant="body-sm">Medium border</Text>
        </GlassCard>

        <GlassCard borderIntensity="high" className="w-full p-4">
          <Text variant="body-sm">High border</Text>
        </GlassCard>
      </div>
    </DemoBackground>
  ),
};

export const WithoutSaturation: Story = {
  args: {
    saturate: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<GlassCard saturate={false}>
  Content
</GlassCard>`,
      },
    },
  },
  render: (args) => (
    <DemoBackground>
      <GlassCard {...args}>
        <CardContent />
      </GlassCard>
    </DemoBackground>
  ),
};

export const AsPanel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<GlassCard className="grid gap-3">
  <Text as="h3" variant="heading-sm">
    Settings panel
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    Use GlassCard for floating panels and elevated surfaces.
  </Text>
</GlassCard>`,
      },
    },
  },
  render: () => (
    <DemoBackground>
      <GlassCard className="grid gap-3">
        <Text as="h3" variant="heading-sm">
          Settings panel
        </Text>

        <Text as="p" variant="body-sm" color="secondary">
          Use GlassCard for floating panels and elevated surfaces.
        </Text>
      </GlassCard>
    </DemoBackground>
  ),
};

export const CompactOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'GlassCard has default rounded corners and padding. Use className only for intentional layout overrides.',
      },
      source: {
        code: `<GlassCard className="rounded-xl p-4">
  Compact glass card
</GlassCard>`,
      },
    },
  },
  render: () => (
    <DemoBackground>
      <GlassCard className="rounded-xl p-4">
        <Text variant="body-sm">Compact glass card</Text>
      </GlassCard>
    </DemoBackground>
  ),
};
