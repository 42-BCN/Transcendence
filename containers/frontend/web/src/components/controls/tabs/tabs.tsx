'use client';

import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
} from 'react-aria-components';
import type {
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabProps as AriaTabProps,
  TabsProps as AriaTabsProps,
} from 'react-aria-components';

import { tabsStyles } from './tabs.styles';

export function Tabs({ className, ...props }: AriaTabsProps) {
  return (
    <AriaTabs
      {...props}
      className={(values) =>
        (typeof className === 'function' ? className(values) : className) || ''
      }
    />
  );
}

export function TabList<T extends object>({ className, ...props }: AriaTabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={(values) =>
        tabsStyles.tabList(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}

export function Tab({ className, children, ...props }: AriaTabProps) {
  return (
    <AriaTab
      {...props}
      className={(values) =>
        tabsStyles.tab(typeof className === 'function' ? className(values) : className)
      }
    >
      {({ isSelected }) => (
        <>
          {children}
          <div data-selected={isSelected || undefined} className={tabsStyles.indicator()} />
        </>
      )}
    </AriaTab>
  );
}

export function TabPanel({ className, ...props }: AriaTabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={(values) =>
        tabsStyles.panel(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}
