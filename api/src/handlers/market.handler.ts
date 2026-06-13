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
import { area_code } from "@prisma/client";

const marketHandler = new Hono<{ Variables: Variables}>();

function resolveAreaFilter(
  jwtArea: area_code | null | undefined,
  queryArea?: area_code
): area_code | undefined {
  const isAdminSession = jwtArea !== undefined;
  return isAdminSession ? (jwtArea ?? undefined) : (queryArea ?? undefined);
}

function assertMarketAreaAccess(
  jwtArea: area_code | null | undefined,
  marketAreaCode: area_code
) {
  if (jwtArea != null && jwtArea !== marketAreaCode) {
    throw new AppError(
      "Accès non autorisé à ce marché",
      403,
      new Error("Market area mismatch")
    );
  }
}

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
  const jwtArea = c.get("areaCode");
  const areaFilter = resolveAreaFilter(jwtArea, query.a ?? undefined);
  const markets = await getAllMarkets(areaFilter);
  return c.json(markets);
});

// GET market by ID
marketHandler.get("/:marketId", async (c) => {
  const { marketId } = c.req.param();
  const jwtArea = c.get("areaCode");
  try {
    const market = await getMarketById(marketId);
    assertMarketAreaAccess(jwtArea, market.areaCode);
    return c.json(market);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.message === "Market not found") {
      throw new AppError("Ce marché n'existe pas", 404, error);
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

async function getMarketAndAssertAccess(
  marketId: string,
  jwtArea: area_code | null | undefined
) {
  const market = await getMarketById(marketId);
  assertMarketAreaAccess(jwtArea, market.areaCode);
  return market;
}

// GET sellers from a market
marketHandler.get("/:marketId/sellers", async (c) => {
  const { marketId } = c.req.param();
  const jwtArea = c.get("areaCode");
  await getMarketAndAssertAccess(marketId, jwtArea);
  const sellers = await getSellersFromMarketById(marketId);
  return c.json(sellers);
});

// GET orders from a market
marketHandler.get("/:marketId/orders", async (c) => {
  const { marketId } = c.req.param();
  const jwtArea = c.get("areaCode");
  await getMarketAndAssertAccess(marketId, jwtArea);
  const orders = await getOrdersByMarketId(marketId);
  return c.json(orders);
});

// GET orders from a market
marketHandler.get("/:marketId/orders-details", async (c) => {
  const { marketId } = c.req.param();
  const jwtArea = c.get("areaCode");
  await getMarketAndAssertAccess(marketId, jwtArea);
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
  const jwtArea = c.get("areaCode");
  if (jwtArea != null && data.areaCode !== jwtArea) {
    throw new AppError(
      "Vous ne pouvez créer un marché que dans votre zone",
      403,
      new Error("Market area mismatch on create")
    );
  }
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
    const jwtArea = c.get("areaCode");

    try {
      const market = await getMarketById(marketId);
      assertMarketAreaAccess(jwtArea, market.areaCode);
      if (jwtArea != null && updateData.areaCode && updateData.areaCode !== jwtArea) {
        throw new AppError(
          "Vous ne pouvez pas déplacer un marché vers une autre zone",
          403,
          new Error("Market area mismatch on update")
        );
      }
      const updatedMarket = await updateMarket(marketId, updateData);
      return c.json(updatedMarket);
    } catch (error) {
      if (error instanceof AppError) throw error;
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
  const jwtArea = c.get("areaCode");
  try {
    const market = await getMarketById(marketId);
    assertMarketAreaAccess(jwtArea, market.areaCode);
    await deleteMarket(marketId);
    return c.json({ message: "Marché supprimé avec succès" }, 200);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.message === "Market not found") {
      throw new AppError("Ce marché n'existe pas", 404, error);
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

export default marketHandler;
