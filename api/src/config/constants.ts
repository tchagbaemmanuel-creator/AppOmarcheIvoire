export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  /** URL publique de l’API (liens dans les e-mails admin), sans slash final. */
  PUBLIC_API_BASE_URL:
    (process.env.PUBLIC_API_BASE_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    ),
};
