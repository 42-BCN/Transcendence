import type { MailTemplateSet } from './shared';

export const enMailTemplates = {
  signupVerification: {
    subject: 'Verify your email',
    text: 'Hi {name},\n\nWelcome. Please verify your email by opening this link:\n{url}\n\nIf you did not create this account, you can ignore this email.',
    html: '<p>Hi {name},</p><p>Welcome. Please verify your email by opening this link:</p><p><a href="{url}">Verify email</a></p><p>If you did not create this account, you can ignore this email.</p>',
  },
  passwordReset: {
    subject: 'Reset your password',
    text: 'Hi {name},\n\nA password reset was requested for your account.\nOpen this link to set a new password:\n{url}\n\nIf you did not request this, you can ignore this email.',
    html: '<p>Hi {name},</p><p>A password reset was requested for your account.</p><p>Open this link to set a new password:</p><p><a href="{url}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>',
  },
  signupAccountExistsNotice: {
    subject: 'This email is already registered',
    text: 'Hi {name},\n\nA new account signup was attempted with this email, but an account already exists.\nIf this was you, try logging in:\n{loginUrl}\n\nOr recover your password here:\n{recoverUrl}\n\nIf this was not you, you can dismiss this email.',
    html: '<p>Hi {name},</p><p>A new account signup was attempted with this email, but an account already exists.</p><p>If this was you, try logging in:</p><p><a href="{loginUrl}">Log in</a></p><p>Or recover your password here:</p><p><a href="{recoverUrl}">Recover password</a></p><p>If this was not you, you can dismiss this email.</p>',
  },
} satisfies MailTemplateSet;
