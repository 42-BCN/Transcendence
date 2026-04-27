/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tab, TabList, TabPanel, Tabs } from './tabs';

const meta = {
  title: 'Components/Controls/Tabs',
  component: Tabs,
  subcomponents: {
    TabList,
    Tab,
    TabPanel,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tabs primitives built on React Aria Components. Use Tabs as the root, TabList for the tab triggers, Tab for each selectable tab, and TabPanel for the matching content.',
      },
    },
  },
  argTypes: {
    defaultSelectedKey: {
      control: 'text',
      description: 'Initial selected tab key when the tabs are uncontrolled.',
      table: {
        category: 'State',
        type: {
          summary: 'Key',
        },
      },
    },
    selectedKey: {
      control: false,
      description: 'Selected tab key when the tabs are controlled.',
      table: {
        category: 'State',
        type: {
          summary: 'Key',
        },
      },
    },
    onSelectionChange: {
      action: 'selection changed',
      description: 'Callback fired when the selected tab changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(key: Key) => void',
        },
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation.',
      table: {
        category: 'Behavior',
        type: {
          summary: "'horizontal' | 'vertical'",
        },
        defaultValue: {
          summary: 'horizontal',
        },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the whole tabs collection.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className passed to the Tabs root.',
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
      description: 'Tabs content composed from TabList, Tab, and TabPanel.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
        disable: true,
      },
    },
  },
  args: {
    defaultSelectedKey: 'overview',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs defaultSelectedKey="overview">
  <TabList aria-label="Profile sections">
    <Tab id="overview">Overview</Tab>
    <Tab id="friends">Friends</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>

  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="friends">Friends content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>`,
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Tabs {...args}>
        <TabList aria-label="Profile sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="friends">Friends</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>

        <TabPanel id="overview">
          <div className="py-4 text-text-secondary">Overview content</div>
        </TabPanel>

        <TabPanel id="friends">
          <div className="py-4 text-text-secondary">Friends content</div>
        </TabPanel>

        <TabPanel id="settings">
          <div className="py-4 text-text-secondary">Settings content</div>
        </TabPanel>
      </Tabs>
    </div>
  ),
};
