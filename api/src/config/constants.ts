export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  /** Clé API Brevo (SMTP & API → clés API). */
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  /** E-mail expéditeur vérifié dans Brevo (obligatoire). */
  BREVO_SENDER_EMAIL:
    process.env.BREVO_SENDER_EMAIL || "noreply@omarcheivoire.ci",
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || "O'Marché Ivoire",
  /** URL publique de l’API (liens dans les e-mails admin), sans slash final. */
  PUBLIC_API_BASE_URL:
    (process.env.PUBLIC_API_BASE_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    ),
};
