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
  ButtonProps as AriaButtonProps,
} from 'react-aria-components';

import { Icon } from '../../primitives/icon';
import { disclosureStyles } from './disclosure.styles';

export type DisclosureProps = AriaDisclosureProps;
export type DisclosureGroupProps = AriaDisclosureGroupProps;
export type DisclosurePanelProps = AriaDisclosurePanelProps;

export function DisclosureGroup({ className, ...props }: DisclosureGroupProps) {
  return <AriaDisclosureGroup {...props} className={className} />;
}

export function Disclosure({ className, children, ...props }: DisclosureProps) {
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

export type DisclosureTriggerProps = AriaButtonProps & {
  title: string;
};

export function DisclosureTrigger({ title, className, ...props }: DisclosureTriggerProps) {
  return (
    <AriaButton
      {...props}
      slot="trigger"
      className={(values) =>
        disclosureStyles.trigger(typeof className === 'function' ? className(values) : className)
      }
    >
      <span className={disclosureStyles.title()}>{title}</span>
      <Icon name="chevronDown" className={disclosureStyles.icon()} />
    </AriaButton>
  );
}

export function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={(values) =>
        disclosureStyles.panel(typeof className === 'function' ? className(values) : className)
      }
    />
  );
}
