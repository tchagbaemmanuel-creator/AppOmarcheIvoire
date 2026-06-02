import prisma from "@prisma/index";
import { area_code, Market } from "@prisma/client";

export async function selectAllMarkets(areaCode?: area_code) {
	// Filtre optionnel : si areaCode n'est pas fourni, on ne filtre pas.
	const markets = await prisma.market.findMany({
		where: areaCode ? { areaCode } : {},
	});
	return markets;
}

export async function updateMarketById(
	marketId: string,
	data: Partial<Market>
) {
	const updatedMarket = await prisma.market.update({
		where: {
			marketId,
		},
		data,
	});
	return updatedMarket;
}

export async function insertMarket(data: {
	name: string;
	latitude: number;
	longitude: number;
	pictureUrl?: string;
	areaCode: Market['areaCode'];
}) {
	const newMarket = await prisma.market.create({
		data,
	});
	return newMarket;
}

export async function selectMarketById(marketId: string) {
	const market = await prisma.market.findUnique({
		where: {
			marketId,
		},
	});
	return market;
}

export async function deleteMarketById(marketId: string) {
	await prisma.market.delete({
		where: {
			marketId,
		},
	});
}
