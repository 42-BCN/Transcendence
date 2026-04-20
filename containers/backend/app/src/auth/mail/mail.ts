import { sendMail } from '@lib/mail.service';

import { mailTemplates, type EmailLocale } from './mail-templates';

export type { EmailLocale } from './mail-templates';

function getPublicAppBaseUrl(): string {
  return process.env.APP_BASE_URL?.trim() || 'https://localhost:8443';
}

export function normalizeEmailLocale(value: string | undefined): EmailLocale {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return 'en';
  if (normalized.startsWith('ca')) return 'ca';
  if (normalized.startsWith('es')) return 'es';
  return 'en';
}

export type SignupVerificationMailInput = {
  toEmail: string;
  username: string;
  verificationToken: string;
  locale?: EmailLocale;
};

export type PasswordResetMailInput = {
  toEmail: string;
  username: string;
  resetToken: string;
  locale?: EmailLocale;
};

export type SignupAccountExistsNoticeMailInput = {
  toEmail: string;
  username: string;
  locale?: EmailLocale;
};

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/{(\w+)}/g, (_match, key: string) => {
    return values[key] ?? '';
  });
}

function verificationMailContent(input: SignupVerificationMailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const verifyUrl = `${getPublicAppBaseUrl()}/verify-email?token=${encodeURIComponent(input.verificationToken)}`;
  const locale = input.locale ?? 'en';
  const copy = mailTemplates[locale].signupVerification;

  return {
    subject: copy.subject,
    text: interpolate(copy.text, { name: input.username, url: verifyUrl }),
    html: interpolate(copy.html, { name: input.username, url: verifyUrl }),
  };
}

function passwordResetMailContent(input: PasswordResetMailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const resetUrl = `${getPublicAppBaseUrl()}/reset-password?token=${encodeURIComponent(input.resetToken)}`;
  const locale = input.locale ?? 'en';
  const copy = mailTemplates[locale].passwordReset;

  return {
    subject: copy.subject,
    text: interpolate(copy.text, { name: input.username, url: resetUrl }),
    html: interpolate(copy.html, { name: input.username, url: resetUrl }),
  };
}

function signupAccountExistsNoticeMailContent(input: SignupAccountExistsNoticeMailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const baseUrl = getPublicAppBaseUrl();
  const loginUrl = `${baseUrl}/login`;
  const recoverUrl = `${baseUrl}/recover`;
  const locale = input.locale ?? 'en';
  const copy = mailTemplates[locale].signupAccountExistsNotice;

  return {
    subject: copy.subject,
    text: interpolate(copy.text, { name: input.username, loginUrl, recoverUrl }),
    html: interpolate(copy.html, { name: input.username, loginUrl, recoverUrl }),
  };
}

export async function sendSignupVerificationEmail(
  input: SignupVerificationMailInput,
): Promise<void> {
  const content = verificationMailContent(input);
  await sendMail({
    to: input.toEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendPasswordResetEmail(input: PasswordResetMailInput): Promise<void> {
  const content = passwordResetMailContent(input);
  await sendMail({
    to: input.toEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendSignupAccountExistsNoticeEmail(
  input: SignupAccountExistsNoticeMailInput,
): Promise<void> {
  const content = signupAccountExistsNoticeMailContent(input);
  await sendMail({
    to: input.toEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}
