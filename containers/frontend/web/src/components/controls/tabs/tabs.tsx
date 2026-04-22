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

type StringClassName = {
  className?: string;
};

export type TabsProps = Omit<AriaTabsProps, 'className'> & StringClassName;
export type TabListProps<T extends object> = Omit<AriaTabListProps<T>, 'className'> &
  StringClassName;
export type TabProps = Omit<AriaTabProps, 'className'> & StringClassName;
export type TabPanelProps = Omit<AriaTabPanelProps, 'className'> & StringClassName;

export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={className} />;
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <AriaTabList {...props} className={tabsStyles.tabList(className)} />;
}

export function Tab({ className, children, ...props }: TabProps) {
  return (
    <AriaTab {...props} className={tabsStyles.tab(className)}>
      {(values) => (typeof children === 'function' ? children(values) : children)}
    </AriaTab>
  );
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} className={tabsStyles.panel(className)} />;
}
