import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "./product";
import { Market } from "./market";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Seller {
	sellerId: string;
	marketId: string;
	pictureUrl?: string;
	firstName: string;
	lastName: string;
	tableNumber: number;
	gender: string;
	isActive?: boolean;
	products?: Product[];
	market: Market;
	createdAt?: Date;
	updatedAt: Date;
}

export interface CreateSellerDTO {
	firstName: string;
	lastName: string;
	pictureUrl?: string;
	gender: "M" | "F";
	tableNumber: number;
	marketId: string;
}

export interface UpdateSellerDTO {
	firstName?: string;
	lastName?: string;
	pictureUrl?: string;
	gender?: "M" | "F";
	tableNumber?: number;
	isActive?: boolean;
}

export const sellerApi = createApi({
	reducerPath: "sellerApi",
	baseQuery: baseQuery,
	tagTypes: ["Seller"],
	endpoints: (builder) => ({
		getAllSellers: builder.query<Seller[], void>({
			query: () => "sellers/",
			providesTags: ["Seller"],
		}),

		getSellerById: builder.query<Seller, string>({
			query: (sellerId) => `sellers/${sellerId}`,
			providesTags: ["Seller"],
		}),

		getSellerProducts: builder.query<Product[], string>({
			query: (sellerId) => `sellers/${sellerId}/products`,
			providesTags: ["Seller"],
		}),

		createSeller: builder.mutation<Seller, CreateSellerDTO>({
			query: (newSeller) => ({
				url: "sellers/",
				method: "POST",
				body: newSeller,
			}),
			invalidatesTags: ["Seller"],
		}),

		updateSeller: builder.mutation<
			Seller,
			{ sellerId: string; updateData: UpdateSellerDTO }
		>({
			query: ({ sellerId, updateData }) => ({
				url: `sellers/${sellerId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Seller"],
		}),

		deleteSeller: builder.mutation<{ message: string }, string>({
			query: (sellerId) => ({
				url: `sellers/${sellerId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Seller"],
		}),
	}),
});

export const {
	useGetAllSellersQuery,
	useGetSellerByIdQuery,
	useGetSellerProductsQuery,
	useCreateSellerMutation,
	useUpdateSellerMutation,
	useDeleteSellerMutation,
} = sellerApi;
