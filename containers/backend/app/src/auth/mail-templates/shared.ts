export type EmailLocale = "ca" | "es" | "en";

export type MailCopy = {
  subject: string;
  text: string;
  html: string;
};

export type MailTemplateSet = {
  signupVerification: MailCopy;
  passwordReset: MailCopy;
};

export type MailTemplateTree = {
  [locale in EmailLocale]: MailTemplateSet;
};
