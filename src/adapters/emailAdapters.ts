import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export const emailAdapters = nodemailerAdapter({
  defaultFromAddress: 'info@payloadcmstest.com',
  defaultFromName: 'Test Payload',
  // Nodemailer transportOptions
  transportOptions: {
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,

    auth: {
      user: process.env.MAIL_SMTP_USER,
      pass: process.env.MAIL_SMTP_PASS,
    },
  },
})
