import type { ReactNode } from 'react';

import { Disclosure, DisclosureTrigger, DisclosurePanel } from '@components/controls/disclosure';

export type DisclosureFullProps = {
  children: ReactNode;
  title: string;
  id: string;
};

export function DisclosureFull({ children, title, id }: DisclosureFullProps) {
  return (
    <Disclosure id={id}>
      <DisclosureTrigger title={title} className="px-3" />
      <DisclosurePanel>{children}</DisclosurePanel>
    </Disclosure>
  );
}
