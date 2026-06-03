import { createHash, randomBytes } from "node:crypto";
import prisma from "@prisma/index";
import { ENV } from "@/config/constants";
import AppError from "@/utils/AppError";
import {
	selectAgentByPhone,
	selectShipperByPhone,
	selectUserByPhone,
} from "../repositories/auth.repository";
import {
	createEmailTemplate,
	EMAIL_LIST,
	sendMail,
} from "@/utils/mail";
import { PasswordResetAdminTemplate } from "@/utils/mail/templates/PasswordResetAdminTemplate";
import type { ForgotPasswordRole } from "./auth.service";

function hashAdminToken(token: string): string {
	return createHash("sha256").update(token, "utf8").digest("hex");
}

function roleLabel(role: ForgotPasswordRole): string {
	if (role === "Client") return "Client";
	if (role === "Agent") return "Agent de marché";
	return "Livreur";
}

async function invalidatePendingForSameAccount(params: {
	role: ForgotPasswordRole;
	userId?: string;
	agentId?: string;
	shipperId?: string;
}) {
	const base = {
		completedAt: null,
		approvedAt: null,
		expiresAt: { gt: new Date() },
	};
	if (params.role === "Client" && params.userId) {
		await prisma.passwordResetRequest.updateMany({
			where: { ...base, role: "Client", userId: params.userId },
			data: { expiresAt: new Date(0) },
		});
	} else if (params.role === "Agent" && params.agentId) {
		await prisma.passwordResetRequest.updateMany({
			where: { ...base, role: "Agent", agentId: params.agentId },
			data: { expiresAt: new Date(0) },
		});
	} else if (params.role === "Shipper" && params.shipperId) {
		await prisma.passwordResetRequest.updateMany({
			where: { ...base, role: "Shipper", shipperId: params.shipperId },
			data: { expiresAt: new Date(0) },
		});
	}
}

export type ForgotPasswordResponse = {
	message: string;
	/** Présent seulement si un compte correspond au numéro (pour l’écran d’attente). */
	requestId?: string;
};

const GENERIC_MESSAGE =
	"Si un compte est associé à ce numéro, la demande a été transmise. Vous serez informé lorsque la réinitialisation sera autorisée.";

export async function createForgotPasswordRequest(params: {
	phone: string;
	role: ForgotPasswordRole;
}): Promise<ForgotPasswordResponse> {
	let userId: string | undefined;
	let agentId: string | undefined;
	let shipperId: string | undefined;

	if (params.role === "Client") {
		const u = await selectUserByPhone(params.phone);
		if (!u) {
			return { message: GENERIC_MESSAGE };
		}
		userId = u.userId;
	} else if (params.role === "Agent") {
		const a = await selectAgentByPhone(params.phone);
		if (!a) {
			return { message: GENERIC_MESSAGE };
		}
		agentId = a.agentId;
	} else {
		const s = await selectShipperByPhone(params.phone);
		if (!s) {
			return { message: GENERIC_MESSAGE };
		}
		shipperId = s.shipperId;
	}

	await invalidatePendingForSameAccount({
		role: params.role,
		userId,
		agentId,
		shipperId,
	});

	const adminToken = randomBytes(32).toString("hex");
	const adminTokenHash = hashAdminToken(adminToken);
	const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

	const row = await prisma.passwordResetRequest.create({
		data: {
			role: params.role,
			userId: userId ?? null,
			agentId: agentId ?? null,
			shipperId: shipperId ?? null,
			adminTokenHash,
			expiresAt,
		},
	});

	const approveUrl = `${ENV.PUBLIC_API_BASE_URL}/auth/forgot-password/approve?token=${encodeURIComponent(adminToken)}`;
	const digits = params.phone.replace(/\D/g, "");
	const phoneLastDigits =
		digits.length >= 4 ? digits.slice(-4) : digits || "—";

	const message = createEmailTemplate(PasswordResetAdminTemplate, {
		roleLabel: roleLabel(params.role),
		phoneLastDigits,
		approveUrl,
	});

	try {
		if (ENV.BREVO_API_KEY) {
			await sendMail(
				message,
				EMAIL_LIST,
				"O'Marché — Réinitialisation mot de passe (action admin)"
			);
		} else {
			console.warn(
				"[password-reset] BREVO_API_KEY manquant — e-mail admin non envoyé"
			);
		}
	} catch (e) {
		console.error("[password-reset] Échec envoi e-mail:", e);
		await prisma.passwordResetRequest.delete({ where: { requestId: row.requestId } });
		throw new AppError(
			"Impossible d'envoyer la demande pour le moment. Réessayez plus tard.",
			503,
			e as Error
		);
	}

	return {
		message: GENERIC_MESSAGE,
		requestId: row.requestId,
	};
}

export type ResetStatus = "pending" | "ready" | "expired" | "completed";

export async function getForgotPasswordStatus(
	requestId: string
): Promise<{ status: ResetStatus }> {
	const row = await prisma.passwordResetRequest.findUnique({
		where: { requestId },
	});
	if (!row) {
		return { status: "expired" };
	}
	if (row.completedAt) {
		return { status: "completed" };
	}
	if (row.expiresAt < new Date()) {
		return { status: "expired" };
	}
	if (row.approvedAt) {
		return { status: "ready" };
	}
	return { status: "pending" };
}

export async function approveForgotPasswordByToken(
	token: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
	if (!token || token.length < 32) {
		return { ok: false, reason: "Lien invalide." };
	}
	const adminTokenHash = hashAdminToken(token);
	const row = await prisma.passwordResetRequest.findUnique({
		where: { adminTokenHash },
	});
	if (!row) {
		return { ok: false, reason: "Lien invalide ou déjà utilisé." };
	}
	if (row.completedAt) {
		return { ok: false, reason: "Cette demande a déjà été traitée." };
	}
	if (row.expiresAt < new Date()) {
		return { ok: false, reason: "Ce lien a expiré." };
	}
	if (row.approvedAt) {
		return { ok: true };
	}
	await prisma.passwordResetRequest.update({
		where: { requestId: row.requestId },
		data: { approvedAt: new Date() },
	});
	return { ok: true };
}

export async function completeForgotPassword(params: {
	requestId: string;
	newPassword: string;
}): Promise<void> {
	if (params.newPassword.length < 8) {
		throw new AppError(
			"Le mot de passe doit contenir au moins 8 caractères",
			400,
			new Error("password too short")
		);
	}

	const row = await prisma.passwordResetRequest.findUnique({
		where: { requestId: params.requestId },
	});
	if (!row || row.expiresAt < new Date()) {
		throw new AppError("Demande introuvable ou expirée", 400, new Error("bad request"));
	}
	if (!row.approvedAt) {
		throw new AppError(
			"La réinitialisation n'a pas encore été validée par un administrateur",
			403,
			new Error("not approved")
		);
	}
	if (row.completedAt) {
		throw new AppError("Ce lien a déjà été utilisé", 400, new Error("already used"));
	}

	const hashed = await Bun.password.hash(params.newPassword);

	if (row.role === "Client" && row.userId) {
		await prisma.user.update({
			where: { userId: row.userId },
			data: { password: hashed },
		});
	} else if (row.role === "Agent" && row.agentId) {
		await prisma.agent.update({
			where: { agentId: row.agentId },
			data: { password: hashed },
		});
	} else if (row.role === "Shipper" && row.shipperId) {
		await prisma.shipper.update({
			where: { shipperId: row.shipperId },
			data: { password: hashed },
		});
	} else {
		throw new AppError("Demande incohérente", 500, new Error("orphan reset"));
	}

	await prisma.passwordResetRequest.update({
		where: { requestId: row.requestId },
		data: { completedAt: new Date() },
	});
}
