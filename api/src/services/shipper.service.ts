import {
	selectAllShippers,
	selectShipperById,
	updateShipperById,
	deleteShipperById,
	createShipper as createShipperRepo,
} from "@/repositories/shipper.repository";
import { Shipper } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getAllShippers(): Promise<Shipper[]> {
	try {
		return await selectAllShippers();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des transporteurs", 500, error as Error);
	}
}

export async function getShipperById(
	shipperId: string
): Promise<Shipper | null> {
	try {
		const shipper = await selectShipperById(shipperId);
		if (!shipper) {
			throw new AppError("Transporteur introuvable", 404, new Error(`Shipper with ID ${shipperId} not found`));
		}
		return shipper;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération du transporteur", 500, error as Error);
	}
}

export async function updateShipper(
	shipperId: string,
	data: Partial<Shipper>
): Promise<Shipper> {
	try {
		const existingShipper = await selectShipperById(shipperId);
		if (!existingShipper) {
			throw new AppError("Transporteur introuvable", 404, new Error(`Shipper with ID ${shipperId} not found`));
		}

		const updatedShipper = await updateShipperById(shipperId, data);
		return updatedShipper;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du transporteur", 500, error as Error);
	}
}

export async function deleteShipper(shipperId: string): Promise<void> {
	try {
		const existingShipper = await selectShipperById(shipperId);
		if (!existingShipper) {
			throw new AppError("Transporteur introuvable", 404, new Error(`Shipper with ID ${shipperId} not found`));
		}

		await deleteShipperById(shipperId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression du transporteur", 500, error as Error);
	}
}

export async function createShipper(
	data: Omit<Shipper, "shipperId" | "createdAt" | "updatedAt">
): Promise<Shipper> {
	try {
		return await createShipperRepo(data);
	} catch (error) {
		throw new AppError("Erreur lors de la création du transporteur", 500, error as Error);
	}
}
