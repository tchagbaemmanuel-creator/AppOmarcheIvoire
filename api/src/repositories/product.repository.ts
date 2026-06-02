import { Product, product_category } from "@prisma/client";
import prisma from "@prisma/index";

export async function selectProductById(productId: string) {
	const product = await prisma.product.findUnique({
		where: {
			productId,
		},
		include: {
			seller: true,
		},
	});
	return product;
}

export async function selectAllProducts() {
	const products = await prisma.product.findMany({
		include: {
			seller: true,
		},
	});
	return products;
}

export async function insertProduct(
	data: Omit<Product, "productId" | "createdAt" | "updatedAt">
) {
	const newProduct = await prisma.product.create({
		data,
		include: {
			seller: true,
		},
	});
	return newProduct;
}

export async function updateProductById(
	productId: string,
	data: Partial<Product>
) {
	const updatedProduct = await prisma.product.update({
		where: {
			productId,
		},
		data,
		include: {
			seller: true,
		},
	});
	return updatedProduct;
}

export async function deleteProductById(productId: string) {
	await prisma.product.delete({
		where: {
			productId,
		},
	});
}

export async function selectProductsBySellerId(sellerId: string) {
	const products = await prisma.product.findMany({
		where: {
			sellerId,
		},
		include: {
			seller: true,
		},
	});
	return products;
}

export async function selectProductsByCategory(category: product_category) {
	const products = await prisma.product.findMany({
		where: {
			category,
		},
		include: {
			seller: true,
		},
	});
	return products;
}
