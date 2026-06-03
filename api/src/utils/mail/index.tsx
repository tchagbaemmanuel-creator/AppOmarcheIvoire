import * as React from "react";
import { render } from "@react-email/render";
import { isBrevoConfigured, sendBrevoEmail } from "./brevo";
import { area_code } from "@prisma/client";

const COMPANY_EMAILS = ["omarchesarl@gmail.com"];
const ADMIN_EMAILS: string[] = [
  "lougbess@gmail.com",
  "audreybohoussou88@gmail.com",
  "Broumambeyomarievictoire@gmail.com",
  "gracekouma286@gmail.com",
  "koffiyohann86@gmail.com",
  "samirakiebre6@gmail.com",
];
const TEST_EMAIL = ["yessochrisa@gmail.com"];
export const EMAIL_LIST = [...COMPANY_EMAILS, ...ADMIN_EMAILS, ...TEST_EMAIL];

export function createEmailTemplate<P extends Record<string, unknown>>(
  template: React.FC<P>,
  props: P
) {
  return React.createElement(template, props);
}

export async function sendMail(
  message: React.ReactNode,
  recipients: string[],
  subject?: string
) {
  if (!isBrevoConfigured()) {
    console.warn(
      "[mail] BREVO_API_KEY manquant — e-mail non envoyé:",
      subject || "notification"
    );
    return null;
  }

  const htmlContent = await render(message);
  const uniqueRecipients = [...new Set(recipients.filter(Boolean))];

  const data = await sendBrevoEmail({
    to: uniqueRecipients.map((email) => ({ email })),
    subject: subject || "O'Marché - Notification",
    htmlContent,
  });

  return data;
}
