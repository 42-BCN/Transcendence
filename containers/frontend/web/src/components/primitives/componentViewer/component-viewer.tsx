import type { ReactNode } from 'react';
import { componentViewerStyles } from './component-viewer.styles';

export type ComponentViewerProps = {
  title: string;
  children: ReactNode;
};

export function ComponentViewer({ title, children }: ComponentViewerProps) {
  const wrapperClass = componentViewerStyles.wrapper();
  const labelClass = componentViewerStyles.label();
  return (
    <div className={wrapperClass}>
      <p className={labelClass}>{title}</p>
      {children}
    </div>
  );
}
