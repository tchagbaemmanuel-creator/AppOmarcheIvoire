import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
	getAllPromoCodes,
	getPromoCodeById,
	createPromoCode,
	updatePromoCode,
	deletePromoCode,
	validatePromoCode,
} from "@/services/promocode.service";
import AppError from "@/utils/AppError";
import { Prisma } from "@prisma/client";
import { Variables } from "..";

const promocodeHandler = new Hono<{ Variables: Variables }>();

const PromoCodeDTO = z.object({
	code: z.string(),
	expiration: z.string().transform((value) => new Date(value)),
	discountType: z.enum(["PERCENTAGE", "FIXED"]),
	amount: z.number().transform((value) => new Prisma.Decimal(value)),
});

// GET all promocodes
promocodeHandler.get("/", async (c) => {
	try {
		const promocodes = await getAllPromoCodes();
		return c.json(promocodes);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des codes promo",
			500,
			error as Error
		);
	}
});

// GET promocode by ID
promocodeHandler.get("/:promoCodeId", async (c) => {
	const { promoCodeId } = c.req.param();
	try {
		const promocode = await getPromoCodeById(promoCodeId);
		if (!promocode) {
			throw new AppError(
				"Ce code promo n'existe pas",
				404,
				new Error("PromoCode not found")
			);
		}
		return c.json(promocode);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

// POST create a new promocode
promocodeHandler.post("/", zValidator("json", PromoCodeDTO), async (c) => {
	const promoCodeData = c.req.valid("json");
	try {
		const newPromoCode = await createPromoCode(promoCodeData);
		return c.json(newPromoCode, 201);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la création du code promo",
			500,
			error as Error
		);
	}
});

// PUT update a promocode
promocodeHandler.put(
	"/:promoCodeId",
	zValidator("json", PromoCodeDTO.partial()),
	async (c) => {
		const { promoCodeId } = c.req.param();
		const updateData = c.req.valid("json");
		try {
			const updatedPromoCode = await updatePromoCode(
				promoCodeId,
				// @ts-ignore
				updateData
			);
			return c.json(updatedPromoCode);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "PromoCode not found"
			) {
				throw new AppError("Ce code promo n'existe pas", 404, error);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

// DELETE a promocode
promocodeHandler.delete("/:promoCodeId", async (c) => {
	const { promoCodeId } = c.req.param();
	try {
		await deletePromoCode(promoCodeId);
		return c.json({ message: "Code promo supprimé avec succès" }, 200);
	} catch (error) {
		if (error instanceof Error && error.message === "PromoCode not found") {
			throw new AppError("Ce code promo n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

// POST validate a promocode
promocodeHandler.post(
	"/validate",
	zValidator("json", z.object({ code: z.string() })),
	async (c) => {
		const { code } = c.req.valid("json");
		const userId = c.get("userId");
		try {
			const validPromoCode = await validatePromoCode(code, userId);
			return c.json(validPromoCode);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Code promo invalide ou expiré"
			) {
				throw new AppError("Code promo invalide ou expiré", 400, error);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

export default promocodeHandler;
