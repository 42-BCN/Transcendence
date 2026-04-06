import { caMailTemplates } from './ca';
import { enMailTemplates } from './en';
import { esMailTemplates } from './es';
import type { MailTemplateTree } from './shared';

export const mailTemplates = {
  ca: caMailTemplates,
  en: enMailTemplates,
  es: esMailTemplates,
} satisfies MailTemplateTree;

export type { EmailLocale, MailCopy, MailTemplateSet, MailTemplateTree } from './shared';
