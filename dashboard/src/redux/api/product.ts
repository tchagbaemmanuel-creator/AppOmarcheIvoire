import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Seller } from "./seller";
import { OrderProducts } from "./order";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type ProductCategory =
	| "Legumes"
	| "Fruits"
	| "Viandes"
	| "Poissons"
	| "Cereales"
	| "Tubercules"
	| "Mer"
	| "Epices"
	| "Autres";

export interface Product {
	productId: string;
	pictureUrl: string[];
	name: string;
	description?: string;
	unit: string;
	amount: number;
	price: number;
	category: ProductCategory;
	sellerId: string;
	isInStock: boolean;
	orderProducts?: OrderProducts[];
	seller: Seller;
	createdAt?: Date;
	updatedAt: Date;
}

export interface CreateProductDTO {
	name: string;
	description: string;
	unit: string;
	amount: number;
	price: number;
	category: ProductCategory;
	pictureUrl: string[];
	sellerId: string;
}

export interface UpdateProductDTO {
	name?: string;
	description?: string;
	unit?: string;
	amount?: number;
	price?: number;
	category?: ProductCategory;
	isInStock?: boolean;
	pictureUrl?: string[];
}

export const productApi = createApi({
	reducerPath: "productApi",
	baseQuery: baseQuery,
	tagTypes: ["Product"],
	endpoints: (builder) => ({
		getAllProducts: builder.query<Product[], void>({
			query: () => "products/",
			providesTags: ["Product"],
		}),

		getProductById: builder.query<Product, string>({
			query: (productId) => `products/${productId}`,
			providesTags: ["Product"],
		}),

		createProduct: builder.mutation<Product, CreateProductDTO>({
			query: (newProduct) => ({
				url: "products/",
				method: "POST",
				body: newProduct,
			}),
			invalidatesTags: ["Product"],
		}),

		updateProduct: builder.mutation<
			Product,
			{ productId: string; updateData: UpdateProductDTO }
		>({
			query: ({ productId, updateData }) => ({
				url: `products/${productId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Product"],
		}),

		deleteProduct: builder.mutation<{ message: string }, string>({
			query: (productId) => ({
				url: `products/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Product"],
		}),
	}),
});

export const {
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productApi;
