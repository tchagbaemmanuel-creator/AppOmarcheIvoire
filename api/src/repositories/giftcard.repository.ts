import prisma from "@prisma/index";
import { GiftCard } from "@prisma/client";

export async function selectAllGiftCards(): Promise<GiftCard[]> {
	return prisma.giftCard.findMany();
}

export async function selectGiftCardById(
	giftCardId: string
): Promise<GiftCard | null> {
	return prisma.giftCard.findUnique({
		where: { giftCardId },
	});
}

export async function insertGiftCard(
	data: Omit<GiftCard, "giftCardId" | "createdAt" | "updatedAt">
): Promise<GiftCard> {
	return prisma.giftCard.create({
		data,
	});
}

export async function updateGiftCardById(
	giftCardId: string,
	data: Partial<GiftCard>
): Promise<GiftCard> {
	return prisma.giftCard.update({
		where: { giftCardId },
		data,
	});
}

export async function deleteGiftCardById(
	giftCardId: string
): Promise<GiftCard> {
	return prisma.giftCard.delete({
		where: { giftCardId },
	});
}

export async function selectGiftCardByUserId(
	userId: string
): Promise<GiftCard | null> {
	return prisma.giftCard.findUnique({
		where: { userId },
	});
}
