import prisma from "@prisma/index";
import { Seller } from "@prisma/client";

export async function selectSellersFromMarketById(marketId: string) {
	const sellers = await prisma.seller.findMany({
		where: {
			marketId,
		},
		include: {
			products: true,
		},
	});
	return sellers;
}

export async function selectSellerById(sellerId: string) {
	const seller = await prisma.seller.findUnique({
		where: {
			sellerId,
		},
		include: {
			market: true,
		},
	});
	return seller;
}

export async function updateSellerById(
	sellerId: string,
	data: Partial<Seller>
) {
	const updatedSeller = await prisma.seller.update({
		where: {
			sellerId,
		},
		data,
	});
	return updatedSeller;
}

export async function selectAllSellers() {
	const sellers = await prisma.seller.findMany({
		include: {
			market: true,
			products: true,
		},
	});
	return sellers;
}

export async function insertSeller(
	data: Omit<Seller, "sellerId" | "createdAt" | "updatedAt">
) {
	const newSeller = await prisma.seller.create({
		data,
		include: {
			market: true,
		},
	});
	return newSeller;
}

export async function deleteSellerById(sellerId: string) {
	await prisma.seller.delete({
		where: {
			sellerId,
		},
	});
}
