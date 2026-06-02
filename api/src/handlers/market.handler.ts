import { Hono } from "hono";
import {
  getAllMarkets,
  getSellersFromMarketById,
  getOrdersByMarketId,
  updateMarket,
  createMarket,
  getMarketById,
  deleteMarket,
  getOrdersDetailsByMarketId,
} from "@/services/market.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import AppError from "@/utils/AppError";
import { Variables } from "..";

const marketHandler = new Hono<{ Variables: Variables}>();

const AreaCodeDTO = z.enum([
  "ABOBO",
  "ADJAME",
  "ATTECOUBE",
  "COCODY",
  "KOUMASSI",
  "MARCORY",
  "PLATEAU",
  "TREICHVILLE",
  "YOPOUGON",
  "BROFODOUME",
  "BINGERVILLE",
  "PORT_BOUET",
  "ANYAMA",
  "SONGON",
]);

export const AreaCodeQueryValidator = z.object({
  a: AreaCodeDTO.optional(),
});

// GET all markets
marketHandler.get("/", zValidator("query", AreaCodeQueryValidator), async (c) => {
  const query = c.req.valid("query");
  const markets = await getAllMarkets(query.a ?? undefined);
  return c.json(markets);
});

// GET market by ID
marketHandler.get("/:marketId", async (c) => {
  const { marketId } = c.req.param();
  try {
    const market = await getMarketById(marketId);
    return c.json(market);
  } catch (error) {
    if (error instanceof Error && error.message === "Market not found") {
      throw new AppError("Ce marché n'existe pas", 404, error);
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

// GET sellers from a market
marketHandler.get("/:marketId/sellers", async (c) => {
  const { marketId } = c.req.param();
  const sellers = await getSellersFromMarketById(marketId);
  return c.json(sellers);
});

// GET orders from a market
marketHandler.get("/:marketId/orders", async (c) => {
  const { marketId } = c.req.param();
  const orders = await getOrdersByMarketId(marketId);
  return c.json(orders);
});

// GET orders from a market
marketHandler.get("/:marketId/orders-details", async (c) => {
  const { marketId } = c.req.param();
  const orders = await getOrdersDetailsByMarketId(marketId);
  return c.json(orders);
});

const CreateMarketDTO = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  pictureUrl: z.string().optional(),
  areaCode: AreaCodeDTO,
});

// POST create a new market
marketHandler.post("/", zValidator("json", CreateMarketDTO), async (c) => {
  const data = c.req.valid("json");
  try {
    const newMarket = await createMarket(data);
    return c.json(newMarket, 201);
  } catch (error) {
    throw new AppError(
      "Erreur lors de la création du marché",
      500,
      error as Error
    );
  }
});

const UpdateMarketDTO = z.object({
  name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().optional(),
  pictureUrl: z.string().nullable(),
  areaCode: AreaCodeDTO.optional(),
});

// PUT update a market
marketHandler.put(
  "/:marketId",
  zValidator("json", UpdateMarketDTO),
  async (c) => {
    const { marketId } = c.req.param();
    const updateData = c.req.valid("json");

    try {
      const updatedMarket = await updateMarket(marketId, updateData);
      return c.json(updatedMarket);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Market not found"
      ) {
        throw new AppError("Ce marché n'existe pas", 404, error);
      }
      throw new AppError("Une erreur est survenue", 500, error as Error);
    }
  }
);

// DELETE a market
marketHandler.delete("/:marketId", async (c) => {
  const { marketId } = c.req.param();
  try {
    await deleteMarket(marketId);
    return c.json({ message: "Marché supprimé avec succès" }, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Market not found") {
      throw new AppError("Ce marché n'existe pas", 404, error);
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

export default marketHandler;
