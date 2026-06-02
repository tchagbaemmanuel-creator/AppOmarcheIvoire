import {
	deleteMarketById,
	insertMarket,
	selectAllMarkets,
	selectMarketById,
	updateMarketById,
} from "@/repositories/market.repository";
import { selectSellersFromMarketById } from "@/repositories/seller.repository";
import { getOrderById, OrderDTO } from "./order.service";
import { selectOrdersByMarketId } from "@/repositories/order.repository";
import { Market, Order } from "@prisma/client";
import AppError from "@/utils/AppError";
import { area_code } from "@prisma/client";

export async function getAllMarkets(areaCode?: area_code) {
	try {
		return await selectAllMarkets(areaCode);
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des marchés", 500, error as Error);
	}
}

export async function getSellersFromMarketById(marketId: string) {
	try {
		const sellers = await selectSellersFromMarketById(marketId);
		if (!sellers || sellers.length === 0) {
		}
		return sellers;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des vendeurs", 500, error as Error);
	}
}

export async function getOrdersByMarketId(marketId: string): Promise<Order[]> {
	try {
		const orders = await selectOrdersByMarketId(marketId);
		return orders;
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des commandes", 500, error as Error);
	}
}

export async function getOrdersDetailsByMarketId(
	marketId: string
): Promise<OrderDTO[]> {
	try {
		const orders = await selectOrdersByMarketId(marketId);
		if (!orders || orders.length === 0) {
		}
		const ordersDTO = await Promise.all(
			orders.map((order) => getOrderById(order.orderId))
		);
		return ordersDTO;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des détails des commandes", 500, error as Error);
	}
}

export async function updateMarket(marketId: string, data: Partial<Market>) {
	try {
		const market = await selectMarketById(marketId);
		if (!market) {
			throw new AppError("Marché introuvable", 404, new Error(`Market with ID ${marketId} not found`));
		}
		const updatedMarket = await updateMarketById(marketId, data);
		return updatedMarket;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du marché", 500, error as Error);
	}
}

export async function createMarket(data: {
	name: string;
	latitude: number;
	longitude: number;
	pictureUrl?: string;
	areaCode: Market['areaCode'];
}) {
	try {
		const newMarket = await insertMarket(data);
		return newMarket;
	} catch (error) {
		throw new AppError("Erreur lors de la création du marché", 500, error as Error);
	}
}

export async function getMarketById(marketId: string) {
	try {
		const market = await selectMarketById(marketId);
		if (!market) {
			throw new AppError("Marché introuvable", 404, new Error(`Market with ID ${marketId} not found`));
		}
		return market;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération du marché", 500, error as Error);
	}
}

export async function deleteMarket(marketId: string) {
	try {
		const market = await selectMarketById(marketId);
		if (!market) {
			throw new AppError("Marché introuvable", 404, new Error(`Market with ID ${marketId} not found`));
		}
		await deleteMarketById(marketId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression du marché", 500, error as Error);
	}
}
