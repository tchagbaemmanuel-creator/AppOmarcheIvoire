import {
	selectProductById,
	selectAllProducts,
	insertProduct,
	updateProductById,
	deleteProductById,
	selectProductsBySellerId,
	selectProductsByCategory,
} from "@/repositories/product.repository";
import { Product, product_category } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getProductById(productId: string) {
	try {
		const product = await selectProductById(productId);
		if (!product) {
			throw new AppError("Produit introuvable", 404, new Error(`Product with ID ${productId} not found`));
		}
		return product;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération du produit", 500, error as Error);
	}
}

export async function getAllProducts() {
	try {
		return await selectAllProducts();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des produits", 500, error as Error);
	}
}

export async function getProductsBySellerId(sellerId: string) {
	try {
		return await selectProductsBySellerId(sellerId);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des produits du vendeur",
			500,
			error as Error
		);
	}
}

export async function getProductsByCategory(category: product_category) {
	try {
		return await selectProductsByCategory(category);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des produits par catégorie",
			500,
			error as Error
		);
	}
}

export async function createProduct(
	data: Omit<Product, "productId" | "createdAt" | "updatedAt">
) {
	try {
		return await insertProduct(data);
	} catch (error) {
		throw new AppError("Erreur lors de la création du produit", 500, error as Error);
	}
}

export async function updateProduct(productId: string, data: Partial<Product>) {
	try {
		const existingProduct = await getProductById(productId);
		if (!existingProduct) {
			throw new AppError("Produit introuvable", 404, new Error(`Product with ID ${productId} not found`));
		}

		const updatedProduct = await updateProductById(productId, data);
		return updatedProduct;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du produit", 500, error as Error);
	}
}

export async function deleteProduct(productId: string) {
	try {
		const existingProduct = await getProductById(productId);
		if (!existingProduct) {
			throw new AppError("Produit introuvable", 404, new Error(`Product with ID ${productId} not found`));
		}

		await deleteProductById(productId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression du produit", 500, error as Error);
	}
}
