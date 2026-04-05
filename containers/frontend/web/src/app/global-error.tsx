'use client';

import enMessages from '@/i18n/messages/en.json';
import esMessages from '@/i18n/messages/es.json';
import caMessages from '@/i18n/messages/ca.json';
import { getLocaleFromDocument } from '@/i18n/get-locale-from-document';

const globalMessages = {
  en: enMessages.common.globalError,
  es: esMessages.common.globalError,
  ca: caMessages.common.globalError,
} as const;

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = getLocaleFromDocument();
  const t = globalMessages[locale];

  return (
    <html lang={locale}>
      <body>
        <h1>{t.title}</h1>
        <button type="button" onClick={() => reset()}>
          {t.tryAgain}
        </button>
      </body>
    </html>
  );
}
