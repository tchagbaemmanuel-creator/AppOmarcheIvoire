/** Normalise un numéro ivoirien pour la recherche en base (chiffres seuls, sans indicatif 225). */
export function normalizePhone(raw: string): string {
	let digits = raw.replace(/\D/g, "");
	if (digits.startsWith("225") && digits.length > 10) {
		digits = digits.slice(3);
	}
	return digits;
}
