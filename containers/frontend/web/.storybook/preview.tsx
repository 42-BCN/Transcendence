import type { Preview } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';

import { mono, primary } from '../src/app/fonts';

import '../src/app/globals.css';
import './preview.css';

import en from '../src/i18n/messages/en.json';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'light' | 'dark';
      const documentElement = context.canvasElement.ownerDocument.documentElement;

      documentElement.classList.add(primary.variable, mono.variable);
      documentElement.classList.toggle('dark', theme === 'dark');

      return (
        <NextIntlClientProvider locale="en" messages={en}>
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
