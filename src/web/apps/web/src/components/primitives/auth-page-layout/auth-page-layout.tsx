import type { ReactNode } from 'react';
import { authPageLayoutStyles } from './auth-page-layout.styles';

export type AuthPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AuthPageLayout({ title, children }: AuthPageLayoutProps) {
  return (
    <main className={authPageLayoutStyles.wrapper()}>
      <h1 className={authPageLayoutStyles.title()}>{title}</h1>
      {children}
    </main>
  );
}
