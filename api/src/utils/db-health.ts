import prisma from "@prisma/index";

let cached: { ok: boolean; checkedAt: number } | null = null;
const CACHE_MS = 30_000;

export async function isDatabaseReachable(): Promise<boolean> {
	const now = Date.now();
	if (cached && now - cached.checkedAt < CACHE_MS) {
		return cached.ok;
	}
	try {
		await prisma.$queryRaw`SELECT 1`;
		cached = { ok: true, checkedAt: now };
		return true;
	} catch {
		cached = { ok: false, checkedAt: now };
		return false;
	}
}
