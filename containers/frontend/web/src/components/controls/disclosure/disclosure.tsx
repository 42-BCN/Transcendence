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

type StringClassName = {
  className?: string;
};

export type DisclosureProps = Omit<AriaDisclosureProps, 'className'> & StringClassName;
export type DisclosureGroupProps = Omit<AriaDisclosureGroupProps, 'className'> & StringClassName;
export type DisclosurePanelProps = Omit<AriaDisclosurePanelProps, 'className'> & StringClassName;

export function DisclosureGroup({ className, ...props }: DisclosureGroupProps) {
  return <AriaDisclosureGroup {...props} className={className} />;
}

export function Disclosure({ className, children, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure {...props} className={disclosureStyles.container(className)}>
      {(values) => (typeof children === 'function' ? children(values) : children)}
    </AriaDisclosure>
  );
}

export type DisclosureTriggerProps = Omit<AriaButtonProps, 'className'> &
  StringClassName & {
    title: string;
  };

export function DisclosureTrigger({ title, className, ...props }: DisclosureTriggerProps) {
  return (
    <AriaButton {...props} slot="trigger" className={disclosureStyles.trigger(className)}>
      <span className={disclosureStyles.title()}>{title}</span>
      <Icon name="chevronDown" className={disclosureStyles.icon()} />
    </AriaButton>
  );
}

export function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  return <AriaDisclosurePanel {...props} className={disclosureStyles.panel(className)} />;
}
