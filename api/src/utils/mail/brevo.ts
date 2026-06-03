import { ENV } from "@/config/constants";

export type BrevoRecipient = { email: string; name?: string };

export type BrevoSendParams = {
	to: BrevoRecipient[];
	subject: string;
	htmlContent: string;
};

export function isBrevoConfigured(): boolean {
	return Boolean(ENV.BREVO_API_KEY);
}

/** Envoi transactionnel via l’API Brevo (offre gratuite). */
export async function sendBrevoEmail(params: BrevoSendParams) {
	if (!ENV.BREVO_API_KEY) {
		throw new Error("BREVO_API_KEY manquant");
	}

	const response = await fetch("https://api.brevo.com/v3/smtp/email", {
		method: "POST",
		headers: {
			"api-key": ENV.BREVO_API_KEY,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			sender: {
				name: ENV.BREVO_SENDER_NAME,
				email: ENV.BREVO_SENDER_EMAIL,
			},
			to: params.to.map((r) => ({
				email: r.email,
				...(r.name ? { name: r.name } : {}),
			})),
			subject: params.subject,
			htmlContent: params.htmlContent,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Brevo API ${response.status}: ${body}`);
	}

	return response.json();
}
