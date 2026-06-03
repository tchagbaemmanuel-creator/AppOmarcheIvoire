import * as React from "react";
import resendClient from "./resend";
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
  if (!resendClient) {
    console.warn(
      "[mail] RESEND_API_KEY manquant — e-mail non envoyé:",
      subject || "notification"
    );
    return null;
  }

  const { data, error } = await resendClient.emails.send({
    from: "O'Marché <info@omarcheivoire.ci>",
    to: recipients,
    subject: subject || "O'Marché - Notification",
    react: message,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw error;
  }

  return data;
}
