import type { MailTemplateSet } from './shared';

export const caMailTemplates = {
  signupVerification: {
    subject: 'Verifica el teu correu electrònic',
    text: 'Hola {name},\n\nBenvingut/da. Verifica el teu correu electrònic obrint aquest enllaç:\n{url}\n\nSi no has creat aquest compte, pots ignorar aquest correu.',
    html: '<p>Hola {name},</p><p>Benvingut/da. Verifica el teu correu electrònic obrint aquest enllaç:</p><p><a href="{url}">Verifica el correu</a></p><p>Si no has creat aquest compte, pots ignorar aquest correu.</p>',
  },
  passwordReset: {
    subject: 'Restableix la teva contrasenya',
    text: "Hola {name},\n\nS'ha sol·licitat un restabliment de contrasenya per al teu compte.\nObre aquest enllaç per establir una contrasenya nova:\n{url}\n\nSi no has sol·licitat això, pots ignorar aquest correu.",
    html: '<p>Hola {name},</p><p>S&#39;ha sol·licitat un restabliment de contrasenya per al teu compte.</p><p>Obre aquest enllaç per establir una contrasenya nova:</p><p><a href="{url}">Restableix la contrasenya</a></p><p>Si no has sol·licitat això, pots ignorar aquest correu.</p>',
  },
  signupAccountExistsNotice: {
    subject: 'Aquest correu ja està registrat',
    text: "Hola {name},\n\nS'ha intentat crear un compte nou amb aquest correu, però ja existeix un compte.\nSi has estat tu, prova d'iniciar sessió:\n{loginUrl}\n\nO recupera la contrasenya aquí:\n{recoverUrl}\n\nSi no has estat tu, pots ignorar aquest correu.",
    html: '<p>Hola {name},</p><p>S&#39;ha intentat crear un compte nou amb aquest correu, però ja existeix un compte.</p><p>Si has estat tu, prova d&#39;iniciar sessió:</p><p><a href="{loginUrl}">Iniciar sessió</a></p><p>O recupera la contrasenya aquí:</p><p><a href="{recoverUrl}">Recuperar contrasenya</a></p><p>Si no has estat tu, pots ignorar aquest correu.</p>',
  },
} satisfies MailTemplateSet;
