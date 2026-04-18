'use client';

import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  Button as AriaButton,
} from 'react-aria-components';
import type {
  DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  DisclosureProps as AriaDisclosureProps,
} from 'react-aria-components';

import { Icon } from '../../primitives/icon';
import { disclosureStyles } from './disclosure.styles';

export function DisclosureGroup({ className, ...props }: AriaDisclosureGroupProps) {
  return <AriaDisclosureGroup {...props} className={className} />;
}

export function Disclosure({ className, children, ...props }: AriaDisclosureProps) {
  return (
    <AriaDisclosure
      {...props}
      className={(values) =>
        disclosureStyles.container(typeof className === 'function' ? className(values) : className)
      }
    >
      {(values) => (typeof children === 'function' ? children(values) : children)}
    </AriaDisclosure>
  );
}

export type DisclosureTriggerProps = {
  title: string;
  className?: string;
};

export function DisclosureTrigger({ title, className }: DisclosureTriggerProps) {
  return (
    <AriaButton slot="trigger" className={disclosureStyles.trigger(className)}>
      <span className={disclosureStyles.title()}>{title}</span>
      <Icon name="chevronDown" className={disclosureStyles.icon()} />
    </AriaButton>
  );
}

export function DisclosurePanel({ className, ...props }: AriaDisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={(values) =>
        disclosureStyles.panel(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}
