import {
	selectAllPromoCodes,
	selectPromoCodeById,
	insertPromoCode,
	updatePromoCodeById,
	deletePromoCodeById,
	selectPromoCodeByCode,
	checkIfPromoCodeUsedByUserId,
} from "@/repositories/promocode.repository";
import { PromoCode } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getAllPromoCodes() {
	try {
		return await selectAllPromoCodes();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des codes promo", 500, error as Error);
	}
}

export async function getPromoCodeById(promoCodeId: string) {
	try {
		const promoCode = await selectPromoCodeById(promoCodeId);
		if (!promoCode) {
			throw new AppError("Code promo introuvable", 404, new Error(`PromoCode with ID ${promoCodeId} not found`));
		}
		return promoCode;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération du code promo", 500, error as Error);
	}
}

export async function createPromoCode(
	data: Omit<PromoCode, "promoCodeId" | "createdAt" | "updatedAt">
) {
	try {
		return await insertPromoCode(data);
	} catch (error) {
		throw new AppError("Erreur lors de la création du code promo", 500, error as Error);
	}
}

export async function updatePromoCode(
	promoCodeId: string,
	data: Partial<PromoCode>
) {
	try {
		const existingPromoCode = await getPromoCodeById(promoCodeId);
		if (!existingPromoCode) {
			throw new AppError("Code promo introuvable", 404, new Error(`PromoCode with ID ${promoCodeId} not found`));
		}

		const updatedPromoCode = await updatePromoCodeById(promoCodeId, data);
		return updatedPromoCode;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du code promo", 500, error as Error);
	}
}

export async function deletePromoCode(promoCodeId: string) {
	try {
		const existingPromoCode = await getPromoCodeById(promoCodeId);
		if (!existingPromoCode) {
			throw new AppError("Code promo introuvable", 404, new Error(`PromoCode with ID ${promoCodeId} not found`));
		}

		await deletePromoCodeById(promoCodeId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression du code promo", 500, error as Error);
	}
}

export async function validatePromoCode(code: string, userId: string) {
	try {
		const promoCode = await selectPromoCodeByCode(code);
		if (!promoCode) {
			throw new AppError("Code promo invalide", 400, new Error(`Invalid promo code: ${code}`));
		}

		const promoCodeIsUsed = await checkIfPromoCodeUsedByUserId(promoCode.promoCodeId, userId);

		if (promoCodeIsUsed) {
			throw new AppError("Code promo déjà utilisé", 400, new Error(`Promo code already used: ${code}`));
		}

		if (new Date(promoCode.expiration) < new Date()) {
			throw new AppError("Code promo expiré", 400, new Error(`Expired promo code: ${code}`));
		}

		return promoCode;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la validation du code promo", 500, error as Error);
	}
}
