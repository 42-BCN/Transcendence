import type { MailTemplateSet } from "./shared";

export const caMailTemplates = {
  signupVerification: {
    subject: "Verifica el teu correu electrònic",
    text: "Hola {name},\n\nBenvingut/da. Verifica el teu correu electrònic obrint aquest enllaç:\n{url}\n\nSi no has creat aquest compte, pots ignorar aquest correu.",
    html: '<p>Hola {name},</p><p>Benvingut/da. Verifica el teu correu electrònic obrint aquest enllaç:</p><p><a href="{url}">Verifica el correu</a></p><p>Si no has creat aquest compte, pots ignorar aquest correu.</p>',
  },
  passwordReset: {
    subject: "Restableix la teva contrasenya",
    text: "Hola {name},\n\nS'ha sol·licitat un restabliment de contrasenya per al teu compte.\nObre aquest enllaç per establir una contrasenya nova:\n{url}\n\nSi no has sol·licitat això, pots ignorar aquest correu.",
    html: '<p>Hola {name},</p><p>S&#39;ha sol·licitat un restabliment de contrasenya per al teu compte.</p><p>Obre aquest enllaç per establir una contrasenya nova:</p><p><a href="{url}">Restableix la contrasenya</a></p><p>Si no has sol·licitat això, pots ignorar aquest correu.</p>',
  },
} satisfies MailTemplateSet;
