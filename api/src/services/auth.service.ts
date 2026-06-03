import { ENV } from "@/config/constants";
import {
	insertAdmin,
	insertAgent,
	insertShipper,
	insertUser,
	selectAdminByEmail,
	selectAgentByPhone,
	selectShipperByPhone,
	selectUserByPhone,
} from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import { Admin, Agent, area_code, Shipper, User } from "@prisma/client";
import AppError from "@/utils/AppError";
import { normalizePhone } from "@/utils/phone";
import { createForgotPasswordRequest } from "./password-reset.service";

export type LoginDTO = {
	phone: string;
	password: string;
};

export async function postLoginUser(params: LoginDTO): Promise<{
	data: User;
	token: string;
}> {
	try {
		const phone = normalizePhone(params.phone);
		let user = await selectUserByPhone(phone);
		if (!user) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("User not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			user.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ userId: user.userId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
		});

		return {
			data: { ...user, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion", 500, error as Error);
	}
}

export type RegisterDTO = {
	password: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
};

export async function postRegisterUser(params: RegisterDTO): Promise<void> {
	try {
		const phone = normalizePhone(params.phone);
		const password = await Bun.password.hash(params.password);
		await insertUser({
			phone,
			password: password,
			firstName: params.firstName,
			lastName: params.lastName,
			address: params.address,
		});
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription", 500, error as Error);
	}
}

export type AgentLoginDTO = {
	phone: string;
	password: string;
};

export type AgentRegisterDTO = {
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
};

export async function postRegisterAgent(
	params: AgentRegisterDTO
): Promise<Agent> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const agent = await insertAgent({
			phone: normalizePhone(params.phone),
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		});
		return { ...agent, password: "" };
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription de l'agent", 500, error as Error);
	}
}

export async function postLoginAgent(params: AgentLoginDTO): Promise<{
	data: Agent;
	token: string;
}> {
	try {
		const phone = normalizePhone(params.phone);
		let agent = await selectAgentByPhone(phone);
		if (!agent) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Agent not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			agent.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ agentId: agent.agentId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
		});

		return {
			data: { ...agent, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion de l'agent", 500, error as Error);
	}
}

export type ShipperLoginDTO = {
	phone: string;
	password: string;
};

export type ShipperRegisterDTO = {
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
};

export async function postRegisterShipper(
	params: ShipperRegisterDTO
): Promise<Shipper> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const shipper = await insertShipper({
			phone: normalizePhone(params.phone),
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		});
		return { ...shipper, password: "" };
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription du livreur", 500, error as Error);
	}
}

export async function postLoginShipper(params: ShipperLoginDTO): Promise<{
	data: Shipper;
	token: string;
}> {
	try {
		const phone = normalizePhone(params.phone);
		let shipper = await selectShipperByPhone(phone);
		if (!shipper) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Shipper not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			shipper.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign(
			{ shipperId: shipper.shipperId },
			ENV.JWT_SECRET,
			{
				expiresIn: ENV.JWT_EXPIRES_IN,
			}
		);

		return {
			data: { ...shipper, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion du livreur", 500, error as Error);
	}
}

export type AdminLoginDTO = {
	email: string;
	password: string;
};

export type AdminRegisterDTO = {
	email: string;
	password: string;
	// optionnel => admin général
	areaCode?: area_code | null;
};

export async function postLoginAdmin(params: AdminLoginDTO): Promise<{
	data: Admin;
	token: string;
}> {
	try {
		const admin = await selectAdminByEmail(params.email);
		if (!admin) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Admin not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			admin.password
		);
		if (!isMatch) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ adminId: admin.adminId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
		});

		return {
			data: { ...admin, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion", 500, error as Error);
	}
}

export async function postRegisterAdmin(params: AdminRegisterDTO): Promise<Admin> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const admin = await insertAdmin({
			email: params.email,
			password: hashedPassword,
			areaCode: params.areaCode ?? null,
		});
		return admin;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'enregistrement", 500, error as Error);
	}
}

export type ForgotPasswordRole = "Client" | "Agent" | "Shipper";

/** Demande de réinitialisation : e-mail aux admins ; `requestId` seulement si un compte existe. */
export async function postForgotPasswordRequest(params: {
	phone: string;
	role: ForgotPasswordRole;
}): Promise<{ message: string; requestId?: string }> {
	return createForgotPasswordRequest(params);
}
