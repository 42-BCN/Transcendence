import type { ReactNode } from 'react';
import { componentViewerClass } from './component-viewer.styles';

export type ComponentViewerProps = {
  title: string;
  children: ReactNode;
};

export function ComponentViewer({ title, children }: ComponentViewerProps) {
  const wrapperClass = componentViewerClass.wrapper();
  const labelClass = componentViewerClass.label();
  return (
    <div className={wrapperClass}>
      <p className={labelClass}>{title}</p>
      {children}
    </div>
  );
}
