'use client';

import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Stack, Icon, InternalLink, Text } from '@components';

type BreadcrumbItem = {
  label: string;
  href: string;
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

export function Breadcrumb({ items, hideHome = false }: BreadcrumbProps) {
  const pathname = usePathname();
  const t = useTranslations('components.breadcrumb');

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    // Auto-generate breadcrumbs from current pathname
    const segments: string[] = pathname
      .split('/')
      .filter((s: string) => s && s !== '(dashboard)' && s !== '(private)');

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

    segments.forEach((segment: string, index: number) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
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
        <Stack key={item.href} direction="horizontal" align="center" gap="sm">
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
