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

export type TabsProps = AriaTabsProps;
export type TabListProps<T extends object> = AriaTabListProps<T>;
export type TabProps = AriaTabProps;
export type TabPanelProps = AriaTabPanelProps;

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <AriaTabs
      {...props}
      className={(values) =>
        (typeof className === 'function' ? className(values) : className) || ''
      }
    />
  );
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={(values) =>
        tabsStyles.tabList(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}

export function Tab({ className, children, ...props }: TabProps) {
  return (
    <AriaTab
      {...props}
      className={(values) =>
        tabsStyles.tab(typeof className === 'function' ? className(values) : className)
      }
    >
      {(values) => (
        <>
          {typeof children === 'function' ? children(values) : children}
          <div data-selected={values.isSelected || undefined} className={tabsStyles.indicator()} />
        </>
      )}
    </AriaTab>
  );
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={(values) =>
        tabsStyles.panel(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}
