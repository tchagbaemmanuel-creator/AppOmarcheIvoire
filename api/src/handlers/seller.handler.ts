import {
	getProductsBySellerId,
	getSellerById,
	updateSeller,
	getAllSellers,
	createSeller,
	deleteSeller,
} from "@/services/seller.service";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import AppError from "@/utils/AppError";

const sellerHandler = new Hono();

// GET all sellers
sellerHandler.get("/", async (c) => {
	try {
		const sellers = await getAllSellers();
		return c.json(sellers);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des vendeurs",
			500,
			error as Error
		);
	}
});

sellerHandler.get("/:sellerId/products", async (c) => {
	const { sellerId } = c.req.param();
	try {
		const products = await getProductsBySellerId(sellerId);
		return c.json(products);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des produits du vendeur",
			500,
			error as Error
		);
	}
});

sellerHandler.get("/:sellerId", async (c) => {
	const { sellerId } = c.req.param();
	try {
		const seller = await getSellerById(sellerId);
		if (!seller) {
			throw new AppError(
				"Ce vendeur n'existe pas",
				404,
				new Error("Seller not found")
			);
		}
		return c.json(seller);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

const UpdateSellerDTO = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	pictureUrl: z.string().nullable(),
	gender: z.enum(["M", "F"]).optional(),
	tableNumber: z.number().optional(),
	isActive: z.boolean().optional(),
});

sellerHandler.put(
	"/:sellerId",
	zValidator("json", UpdateSellerDTO),
	async (c) => {
		const { sellerId } = c.req.param();
		const updateData = c.req.valid("json");

		try {
			const updatedSeller = await updateSeller(sellerId, updateData);
			return c.json(updatedSeller);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Ce vendeur n'existe pas"
			) {
				throw new AppError("Ce vendeur n'existe pas", 404, error);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

// POST create a new seller
const CreateSellerDTO = z.object({
	firstName: z.string(),
	lastName: z.string(),
	pictureUrl: z.string().url().optional(),
	gender: z.enum(["M", "F"]),
	tableNumber: z.number(),
	marketId: z.string().uuid(),
});

sellerHandler.post("/", zValidator("json", CreateSellerDTO), async (c) => {
	const sellerData = c.req.valid("json");
	try {
		const newSeller = await createSeller({
			...sellerData,
			pictureUrl: sellerData.pictureUrl || null,
		});
		return c.json(newSeller, 201);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la création du vendeur",
			500,
			error as Error
		);
	}
});

// DELETE a seller
sellerHandler.delete("/:sellerId", async (c) => {
	const { sellerId } = c.req.param();
	try {
		await deleteSeller(sellerId);
		return c.json({ message: "Vendeur supprimé avec succès" }, 200);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Ce vendeur n'existe pas"
		) {
			throw new AppError("Ce vendeur n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

export default sellerHandler;
