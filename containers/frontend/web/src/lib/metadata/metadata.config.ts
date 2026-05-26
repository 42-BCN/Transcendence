import type { Metadata } from 'next';

import { envPublic } from '@/lib/config/env.public';

export const appName = 'Transcendence';
export const defaultTitle = appName;
export const titleTemplate = `%s | ${appName}`;
export const defaultDescription =
  'Transcendence is a social game platform for playing, chatting, and managing your account.';

export function getMetadataBase(): URL {
  return new URL(envPublic.appUrl);
}

export function createAppMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: getMetadataBase(),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: defaultDescription,
    ...overrides,
    openGraph: {
      type: 'website',
      siteName: appName,
      title: defaultTitle,
      description: defaultDescription,
      url: '/',
      ...overrides.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      ...overrides.twitter,
    },
    robots: {
      index: true,
      follow: true,
      ...overrides.robots,
    },
  };
}

export function createNoIndexMetadata(overrides: Metadata = {}): Metadata {
  return createAppMetadata({
    ...overrides,
    robots: {
      index: false,
      follow: false,
      ...overrides.robots,
    },
  });
}

type RouteMetadataOptions = {
  title: string;
  description?: string;
  canonical?: string;
  index?: boolean;
};

export function createRouteMetadata({
  title,
  description = defaultDescription,
  canonical,
  index = true,
}: RouteMetadataOptions): Metadata {
  const baseMetadata = index ? createAppMetadata : createNoIndexMetadata;

  return baseMetadata({
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index,
      follow: index,
    },
  });
}
