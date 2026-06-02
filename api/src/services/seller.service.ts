import { selectProductsBySellerId } from "@/repositories/product.repository";
import {
	selectSellerById,
	updateSellerById,
	selectAllSellers,
	insertSeller,
	deleteSellerById,
} from "@/repositories/seller.repository";
import { Seller } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getProductsBySellerId(sellerId: string) {
	try {
		const products = await selectProductsBySellerId(sellerId);
		return products;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des produits du vendeur", 500, error as Error);
	}
}

export async function getSellerById(sellerId: string) {
	try {
		const seller = await selectSellerById(sellerId);
		if (!seller) {
			throw new AppError("Vendeur introuvable", 404, new Error(`Seller with ID ${sellerId} not found`));
		}
		return seller;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération du vendeur", 500, error as Error);
	}
}

export async function updateSeller(sellerId: string, data: Partial<Seller>) {
	try {
		const existingSeller = await selectSellerById(sellerId);
		if (!existingSeller) {
			throw new AppError("Vendeur introuvable", 404, new Error(`Seller with ID ${sellerId} not found`));
		}

		const updatedSeller = await updateSellerById(sellerId, data);
		return updatedSeller;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du vendeur", 500, error as Error);
	}
}

export async function getAllSellers() {
	try {
		return await selectAllSellers();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des vendeurs", 500, error as Error);
	}
}

export async function createSeller(
	data: Omit<Seller, "sellerId" | "createdAt" | "updatedAt" | "isActive">
) {
	try {
		const newSeller = await insertSeller({ ...data, isActive: true });
		return newSeller;
	} catch (error) {
		throw new AppError("Erreur lors de la création du vendeur", 500, error as Error);
	}
}

export async function deleteSeller(sellerId: string) {
	try {
		const existingSeller = await selectSellerById(sellerId);
		if (!existingSeller) {
			throw new AppError("Vendeur introuvable", 404, new Error(`Seller with ID ${sellerId} not found`));
		}

		await deleteSellerById(sellerId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression du vendeur", 500, error as Error);
	}
}
