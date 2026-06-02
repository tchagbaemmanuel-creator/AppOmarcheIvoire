import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
	getAllGiftCards,
	getGiftCardById,
	createGiftCard,
	updateGiftCard,
	deleteGiftCard,
	assignGiftCardToUser,
} from "@/services/giftcard.service";
import AppError from "@/utils/AppError";

const giftcardHandler = new Hono();

const GiftCardDTO = z.object({
	userId: z.string().uuid(),
	expiration: z.string().datetime(),
	status: z.enum(["IDLE", "USED", "EXPIRED"]),
});

giftcardHandler.get("/", async (c) => {
	try {
		const giftcards = await getAllGiftCards();
		return c.json(giftcards);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des cartes cadeaux",
			500,
			error as Error
		);
	}
});

//assign a giftcard to a user
giftcardHandler.post(
	"/:giftCardId/assign",
	zValidator(
		"json",
		z.object({
			userId: z.string().uuid(),
		})
	),
	async (c) => {
		const { giftCardId } = c.req.param();
		const { userId } = c.req.valid("json");
		try {
			const newGiftCard = await assignGiftCardToUser(giftCardId, userId);
			return c.json(newGiftCard, 201);
		} catch (error) {
			throw new AppError(
				"Erreur lors de l'assignation de la carte cadeau",
				500,
				error as Error
			);
		}
	}
);

giftcardHandler.get("/:giftCardId", async (c) => {
	const { giftCardId } = c.req.param();
	try {
		const giftcard = await getGiftCardById(giftCardId);
		if (!giftcard) {
			throw new AppError(
				"Cette carte cadeau n'existe pas",
				404,
				new Error("GiftCard not found")
			);
		}
		return c.json(giftcard);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

giftcardHandler.post("/", zValidator("json", GiftCardDTO), async (c) => {
	const giftCardData = c.req.valid("json");
	try {
		// @ts-ignore
		const newGiftCard = await createGiftCard(giftCardData);
		return c.json(newGiftCard, 201);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la création de la carte cadeau",
			500,
			error as Error
		);
	}
});

giftcardHandler.put(
	"/:giftCardId",
	zValidator("json", GiftCardDTO.partial()),
	async (c) => {
		const { giftCardId } = c.req.param();
		const updateData = c.req.valid("json");
		try {
			const updatedGiftCard = await updateGiftCard(
				giftCardId,
				// @ts-ignore
				updateData
			);
			return c.json(updatedGiftCard);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "GiftCard not found"
			) {
				throw new AppError(
					"Cette carte cadeau n'existe pas",
					404,
					error
				);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

giftcardHandler.delete("/:giftCardId", async (c) => {
	const { giftCardId } = c.req.param();
	try {
		await deleteGiftCard(giftCardId);
		return c.json({ message: "Carte cadeau supprimée avec succès" }, 200);
	} catch (error) {
		if (error instanceof Error && error.message === "GiftCard not found") {
			throw new AppError("Cette carte cadeau n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

export default giftcardHandler;
