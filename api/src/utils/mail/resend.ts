import { ENV } from "@/config/constants";
import { Resend } from "resend";

const resend = new Resend(ENV.RESEND_API_KEY);

export default resend;
