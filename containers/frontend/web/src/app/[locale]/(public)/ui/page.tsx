'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const uiSubpages = [
  { href: '/ui/chat', labelKey: 'links.chat' },
  { href: '/ui/glass-card', labelKey: 'links.glassCard' },
  { href: '/ui/glass-card-animated', labelKey: 'links.glassCardAnimated' },
  { href: '/ui/glass-card-animated-v2', labelKey: 'links.glassCardAnimatedV2' },
  { href: '/ui/glass-card-animated-v3', labelKey: 'links.glassCardAnimatedV3' },
  { href: '/ui/message-bubble', labelKey: 'links.messageBubble' },
  { href: '/ui/meter', labelKey: 'links.meter' },
  { href: '/ui/scroll-area', labelKey: 'links.scrollArea' },
  { href: '/ui/text-area', labelKey: 'links.textArea' },
  { href: '/ui/theme-test', labelKey: 'links.themeTest' },
  { href: '/ui/typography', labelKey: 'links.typography' },
] as const;

export default function UiPage() {
  const t = useTranslations('pages.ui.index');

  return (
    <main className="p-5">
      <h1 className="text-2xl font-semibold mb-4">{t('controlComponents')}</h1>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {uiSubpages.map((subpage) => (
          <li key={subpage.href}>
            <Link
              href={subpage.href}
              className="block rounded-md border border-border-primary px-3 py-2 hover:bg-bg-secondary"
            >
              {t(subpage.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
