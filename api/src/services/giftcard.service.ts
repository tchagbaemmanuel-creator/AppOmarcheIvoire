import {
	selectAllGiftCards,
	selectGiftCardById,
	insertGiftCard,
	updateGiftCardById,
	deleteGiftCardById,
	selectGiftCardByUserId,
} from "@/repositories/giftcard.repository";
import { GiftCard } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getAllGiftCards() {
	try {
		return await selectAllGiftCards();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des cartes cadeaux", 500, error as Error);
	}
}

export async function getGiftCardById(giftCardId: string) {
	try {
		const giftCard = await selectGiftCardById(giftCardId);
		if (!giftCard) {
			throw new AppError("Carte cadeau introuvable", 404, new Error(`GiftCard with ID ${giftCardId} not found`));
		}
		return giftCard;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération de la carte cadeau", 500, error as Error);
	}
}

export async function assignGiftCardToUser(giftCardId: string, userId: string) {
	try {
		const giftCard = await selectGiftCardById(giftCardId);
		if (!giftCard) {
			throw new AppError("Carte cadeau introuvable", 404, new Error(`GiftCard with ID ${giftCardId} not found`));
		}
		
		return await updateGiftCardById(giftCardId, { userId });
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'attribution de la carte cadeau", 500, error as Error);
	}
}

export async function createGiftCard(
	data: Omit<GiftCard, "giftCardId" | "createdAt" | "updatedAt">
) {
	try {
		return await insertGiftCard(data);
	} catch (error) {
		throw new AppError("Erreur lors de la création de la carte cadeau", 500, error as Error);
	}
}

export async function updateGiftCard(
	giftCardId: string,
	data: Partial<GiftCard>
) {
	try {
		const existingGiftCard = await getGiftCardById(giftCardId);
		if (!existingGiftCard) {
			throw new AppError("Carte cadeau introuvable", 404, new Error(`GiftCard with ID ${giftCardId} not found`));
		}

		const updatedGiftCard = await updateGiftCardById(giftCardId, data);
		return updatedGiftCard;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour de la carte cadeau", 500, error as Error);
	}
}

export async function deleteGiftCard(giftCardId: string) {
	try {
		const existingGiftCard = await getGiftCardById(giftCardId);
		if (!existingGiftCard) {
			throw new AppError("Carte cadeau introuvable", 404, new Error(`GiftCard with ID ${giftCardId} not found`));
		}

		await deleteGiftCardById(giftCardId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression de la carte cadeau", 500, error as Error);
	}
}

export async function getGiftCardByUserId(userId: string) {
	try {
		const giftCard = await selectGiftCardByUserId(userId);
		return giftCard;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération de la carte cadeau", 500, error as Error);
	}
}
