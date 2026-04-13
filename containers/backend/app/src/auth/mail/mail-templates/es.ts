import type { MailTemplateSet } from './shared';

export const esMailTemplates = {
  signupVerification: {
    subject: 'Verifica tu correo electrónico',
    text: 'Hola {name},\n\nBienvenido. Verifica tu correo electrónico abriendo este enlace:\n{url}\n\nSi no has creado esta cuenta, puedes ignorar este correo.',
    html: '<p>Hola {name},</p><p>Bienvenido. Verifica tu correo electrónico abriendo este enlace:</p><p><a href="{url}">Verificar correo</a></p><p>Si no has creado esta cuenta, puedes ignorar este correo.</p>',
  },
  passwordReset: {
    subject: 'Restablece tu contraseña',
    text: 'Hola {name},\n\nSe ha solicitado un restablecimiento de contraseña para tu cuenta.\nAbre este enlace para crear una nueva contraseña:\n{url}\n\nSi no has solicitado esto, puedes ignorar este correo.',
    html: '<p>Hola {name},</p><p>Se ha solicitado un restablecimiento de contraseña para tu cuenta.</p><p>Abre este enlace para crear una nueva contraseña:</p><p><a href="{url}">Restablecer contraseña</a></p><p>Si no has solicitado esto, puedes ignorar este correo.</p>',
  },
  signupAccountExistsNotice: {
    subject: 'Este correo ya esta registrado',
    text: 'Hola {name},\n\nSe intento crear una cuenta nueva con este correo, pero ya existe una cuenta.\nSi fuiste tu, intenta iniciar sesion:\n{loginUrl}\n\nO recupera tu contrasena aqui:\n{recoverUrl}\n\nSi no fuiste tu, puedes ignorar este correo.',
    html: '<p>Hola {name},</p><p>Se intento crear una cuenta nueva con este correo, pero ya existe una cuenta.</p><p>Si fuiste tu, intenta iniciar sesion:</p><p><a href="{loginUrl}">Iniciar sesion</a></p><p>O recupera tu contrasena aqui:</p><p><a href="{recoverUrl}">Recuperar contrasena</a></p><p>Si no fuiste tu, puedes ignorar este correo.</p>',
  },
} satisfies MailTemplateSet;
