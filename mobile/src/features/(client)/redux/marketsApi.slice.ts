import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Seller } from "./sellersApi.slice";
import { Order } from "./ordersApi.slice";
import { baseQuery } from "@/features/auth/redux/baseApi";

export type Market = {
	marketId: string;
	name: string;
	latitude: number;
	longitude: number;
	isActive: boolean;
	pictureUrl: string | undefined;
};

export const marketsApi = createApi({
	reducerPath: "marketsApi",
	baseQuery,
	endpoints: (builder) => ({
		fetchMarkets: builder.query<Market[], void>({
			query: () => ({
				url: "/markets/",
				method: "GET",
			}),
		}),
		fetchMarketById: builder.query<Market, string>({
			query: (marketId) => ({
				url: `/markets/${marketId}`,
				method: "GET",
			}),
		}),
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/markets/${marketId}/sellers`,
				method: "GET",
			}),
		}),
		getOrdersByMarketId: builder.query<Order[], string>({
			query: (marketId) => ({
				url: `/markets/${marketId}/orders`,
				method: "GET",
			}),
		}),
	}),
});

export const {
	useFetchMarketsQuery,
	useFetchSellersByMarketIdQuery,
	useGetOrdersByMarketIdQuery,
	useFetchMarketByIdQuery,
} = marketsApi;

export default marketsApi;
