import { ENV } from "@/config/constants";
import { Resend } from "resend";

/** Client Resend uniquement si RESEND_API_KEY est définie (évite le crash au démarrage sur Render). */
export const resendClient = ENV.RESEND_API_KEY
	? new Resend(ENV.RESEND_API_KEY)
	: null;

export default resendClient;
