import { Hono } from "hono";
import {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySellerId,
  getProductsByCategory,
} from "@/services/product.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import AppError from "@/utils/AppError";

const UpdateProductDTO = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  unit: z.enum([
    "KG",
    "DEMI_KG",
    "TAS",
    "LITRE",
    "SAC",
    "BOITE",
    "MORCEAUX",
    "UNIT",
    "AUTRE"
  ]).optional(),
  isInStock: z.boolean().optional(),
  amount: z.number().optional(),
  price: z
    .number()
    .transform((value) => new Prisma.Decimal(value))
    .optional(),
  category: z
    .enum([
      "Legumes",
      "Fruits",
      "Viandes",
      "Poissons",
      "Cereales",
      "Tubercules",
      "Mer",
      "Epices",
      "Autres",
    ])
    .optional(),
  pictureUrl: z.array(z.string()).optional(),
});

const CreateProductDTO = z.object({
  name: z.string(),
  description: z.string().nullable(),
  unit: z.enum([
    "KG",
    "DEMI_KG",
    "TAS",
    "LITRE",
    "SAC",
    "BOITE",
    "MORCEAUX",
    "UNIT",
    "AUTRE"
  ]).default("KG"),
  amount: z.number(),
  price: z.number().transform((value) => new Prisma.Decimal(value)),
  category: z.enum([
    "Legumes",
    "Fruits",
    "Viandes",
    "Poissons",
    "Cereales",
    "Tubercules",
    "Mer",
    "Epices",
    "Autres",
  ]).default("Legumes"),
  pictureUrl: z.array(z.string()),
  sellerId: z.string(),
  isInStock: z.boolean().default(true),
});

const productHandler = new Hono();

// GET all products
productHandler.get("/", async (c) => {
  try {
    const products = await getAllProducts();
    return c.json(products);
  } catch (error) {
    throw new AppError(
      "Erreur lors de la récupération des produits",
      500,
      error as Error
    );
  }
});

// Routes statiques avant /:productId (sinon "seller" / "category" sont pris pour un id produit)
productHandler.get("/seller/:sellerId", async (c) => {
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

const CategoryParam = z.enum([
  "Legumes",
  "Fruits",
  "Viandes",
  "Poissons",
  "Cereales",
  "Tubercules",
  "Mer",
  "Epices",
  "Autres",
]);

productHandler.get("/category/:category", async (c) => {
  const raw = c.req.param("category");
  const parsed = CategoryParam.safeParse(raw);
  if (!parsed.success) {
    throw new AppError("Catégorie invalide", 400, new Error("Invalid category"));
  }
  try {
    const products = await getProductsByCategory(parsed.data);
    return c.json(products);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Erreur lors de la récupération des produits par catégorie",
      500,
      error as Error
    );
  }
});

// GET product by ID
productHandler.get("/:productId", async (c) => {
  const { productId } = c.req.param();
  try {
    const product = await getProductById(productId);
    if (!product) {
      throw new AppError(
        "Ce produit n'existe pas",
        404,
        new Error("Product not found")
      );
    }
    return c.json(product);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

// POST create a new product
productHandler.post("/", zValidator("json", CreateProductDTO), async (c) => {
  const productData = c.req.valid("json");
  try {
    const newProduct = await createProduct(productData);
    return c.json(newProduct, 201);
  } catch (error) {
    console.error(error)
    throw new AppError(
      "Erreur lors de la création du produit",
      500,
      error as Error
    );
  }
});

// PUT update a product
productHandler.put(
  "/:productId",
  zValidator("json", UpdateProductDTO),
  async (c) => {
    const { productId } = c.req.param();
    let updateData = c.req.valid("json");

    try {
      const updatedProduct = await updateProduct(productId, updateData);
      return c.json(updatedProduct);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Ce produit n'existe pas"
      ) {
        throw new AppError("Ce produit n'existe pas", 404, error);
      }
      throw new AppError("Une erreur est survenue", 500, error as Error);
    }
  }
);

// DELETE a product
productHandler.delete("/:productId", async (c) => {
  const { productId } = c.req.param();
  try {
    await deleteProduct(productId);
    return c.json({ message: "Produit supprimé avec succès" }, 200);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Ce produit n'existe pas"
    ) {
      throw new AppError("Ce produit n'existe pas", 404, error);
    }
    throw new AppError("Une erreur est survenue", 500, error as Error);
  }
});

export default productHandler;
