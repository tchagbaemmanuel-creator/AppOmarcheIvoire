import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "./productsApi.slice";
import { baseQuery } from "@/features/auth/redux/baseApi";

export type Seller = {
	sellerId: string;
	marketId: string;
	pictureUrl: string | undefined;
	firstName: string;
	lastName: string;
	tableNumber: number;
	products: Product[];
	gender: "M" | "F";
	isActive: boolean;
};

export const sellersApi = createApi({
	reducerPath: "sellersApi",
	baseQuery,
	tagTypes: ["Seller", "Product"],
	endpoints: (builder) => ({
		fetchProductsBySellerId: builder.query<Product[], string>({
			query: (sellerId) => ({
				url: `/sellers/${sellerId}/products`,
				method: "GET",
			}),
			providesTags: ["Product"],
		}),
		fetchSellerById: builder.query<Seller, string>({
			query: (sellerId) => ({
				url: `/sellers/${sellerId}`,
				method: "GET",
			}),
			providesTags: ["Seller"],
		}),
		updateSellerById: builder.mutation<
			Partial<Seller>,
			{ sellerId: string; data: Partial<Seller> }
		>({
			query: ({ sellerId, data }) => ({
				url: `/sellers/${sellerId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Seller"],
		}),
		deleteSellerById: builder.mutation<void, string>({
			query: (sellerId) => ({
				url: `/sellers/${sellerId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Seller"],
		}),
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/markets/${marketId}/sellers`,
				method: "GET",
			}),
			providesTags: ["Seller"],
		}),
		createSeller: builder.mutation<Seller, Partial<Seller>>({
			query: (newSeller) => ({
				url: "/sellers/",
				method: "POST",
				body: newSeller,
			}),
			invalidatesTags: ["Seller"],
		}),
	}),
});

export const {
	useFetchProductsBySellerIdQuery,
	useFetchSellerByIdQuery,
	useFetchSellersByMarketIdQuery,
	useCreateSellerMutation,
	useUpdateSellerByIdMutation,
	useDeleteSellerByIdMutation,
} = sellersApi;

export default sellersApi;
