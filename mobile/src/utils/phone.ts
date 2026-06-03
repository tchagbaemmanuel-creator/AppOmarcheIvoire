/** Même règle que l'API : 07XXXXXXXX ou +225 07… → 07XXXXXXXX */
export function normalizePhone(raw: string): string {
	let digits = raw.replace(/\D/g, "");
	if (digits.startsWith("225") && digits.length > 10) {
		digits = digits.slice(3);
	}
	return digits;
}
