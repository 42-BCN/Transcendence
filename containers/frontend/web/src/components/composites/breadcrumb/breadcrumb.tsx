'use client';

import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { Stack, Icon, InternalLink, Text } from '@components';
import type { InternalLinkProps } from '@components/controls/link';

type BreadcrumbHref = InternalLinkProps['href'];

type BreadcrumbItem = {
  label: string;
  href: BreadcrumbHref;
};

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  hideHome?: boolean;
}

function formatSegmentLabel(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toBreadcrumbHref(href: string): BreadcrumbHref {
  return href as BreadcrumbHref;
}

export function Breadcrumb({ items, hideHome = false }: BreadcrumbProps) {
  const pathname = usePathname();
  const t = useTranslations('components.breadcrumb');

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    const segments = pathname
      .split('/')
      .filter((segment) => segment && segment !== '(dashboard)' && segment !== '(private)');

    const breadcrumbs: BreadcrumbItem[] = [];

    if (!hideHome) {
      breadcrumbs.push({
        label: t('home'),
        href: '/',
      });
    }

    const staticLabels: Record<string, string> = {
      me: t('me'),
      'reset-password': t('reset-password'),
    };

    segments.forEach((segment, index) => {
      const href = toBreadcrumbHref(`/${segments.slice(0, index + 1).join('/')}`);
      const label = staticLabels[segment] ?? formatSegmentLabel(segment);

      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length === 0) return null;

  return (
    <Stack direction="horizontal" align="center" gap="sm">
      {breadcrumbItems.map((item, index) => (
        <Stack key={String(item.href)} direction="horizontal" align="center" gap="sm">
          {index > 0 && <Icon name="chevronRight" size={16} className="text-text-tertiary" />}

          {index === breadcrumbItems.length - 1 ? (
            <Text variant="body-xs" className="text-text-secondary font-medium">
              {item.label}
            </Text>
          ) : (
            <InternalLink href={item.href} size="sm">
              {item.label}
            </InternalLink>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
