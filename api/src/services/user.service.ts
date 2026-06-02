import {
	selectAllUsers,
	selectUserById,
	insertUser,
	updateUserById,
	deleteUserById,
} from "@/repositories/user.repository";
import { Order, User } from "@prisma/client";
import { selectOrdersByUserId } from "@/repositories/order.repository";
import AppError from "@/utils/AppError";

export async function createUser(params: {
	email?: string | null;
	password: string;
	firstName: string;
	lastName: string;
	city?: string | null;
	address: string;
	phone: string;
}): Promise<User> {
	try {
		const hashed = await Bun.password.hash(params.password);
		return await insertUser({
			...params,
			password: hashed,
		});
	} catch (error) {
		// Prisma "unique constraint failed" (email/phone) arrive souvent ici
		throw new AppError("Erreur lors de la création de l'utilisateur", 500, error as Error);
	}
}

export async function getAllUsers(): Promise<User[]> {
	try {
		return await selectAllUsers();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des utilisateurs", 500, error as Error);
	}
}

export async function getUserById(userId: string): Promise<User | null> {
	try {
		const user = await selectUserById(userId);
		if (!user) {
			throw new AppError("Utilisateur introuvable", 404, new Error(`User with ID ${userId} not found`));
		}
		return user;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération de l'utilisateur", 500, error as Error);
	}
}

export async function updateUser(
	userId: string,
	data: Partial<User>
): Promise<User> {
	try {
		const existingUser = await selectUserById(userId);
		if (!existingUser) {
			throw new AppError("Utilisateur introuvable", 404, new Error(`User with ID ${userId} not found`));
		}
		let password = data.password;
		if (password) {
			password = await Bun.password.hash(password);
		} else {
			password = existingUser.password;
		}

		return await updateUserById(userId, { ...data, password });
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour de l'utilisateur", 500, error as Error);
	}
}

export async function deleteUser(userId: string): Promise<void> {
	try {
		const existingUser = await selectUserById(userId);
		if (!existingUser) {
			throw new AppError("Utilisateur introuvable", 404, new Error(`User with ID ${userId} not found`));
		}

		await deleteUserById(userId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression de l'utilisateur", 500, error as Error);
	}
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
	try {
		const orders = await selectOrdersByUserId(userId);
		return orders;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des commandes de l'utilisateur", 500, error as Error);
	}
}

export async function changeMyPassword(params: {
	userId: string;
	currentPassword: string;
	newPassword: string;
}): Promise<void> {
	try {
		const user = await selectUserById(params.userId);
		if (!user) {
			throw new AppError("Utilisateur introuvable", 404, new Error("User not found"));
		}

		const isMatch = await Bun.password.verify(params.currentPassword, user.password);
		if (!isMatch) {
			throw new AppError("Ancien mot de passe incorrect", 400, new Error("Invalid current password"));
		}

		const hashed = await Bun.password.hash(params.newPassword);
		await updateUserById(params.userId, { password: hashed });
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors du changement de mot de passe", 500, error as Error);
	}
}
