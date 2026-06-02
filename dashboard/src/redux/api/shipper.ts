import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "./order";
import { Market } from "./market";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Shipper {
	shipperId: string;
	marketId: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	pictureUrl?: string;
	isOnline: boolean;
	market: Market;
	orders?: Order[];
	createdAt?: Date;
	updatedAt: Date;
}

export interface CreateShipperDTO {
	marketId: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	pictureUrl?: string;
}

export interface UpdateShipperDTO {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	pictureUrl?: string;
	isOnline?: boolean;
	password?: string;
}

export const shipperApi = createApi({
	reducerPath: "shipperApi",
	baseQuery: baseQuery,
	tagTypes: ["Shipper"],
	endpoints: (builder) => ({
		getAllShippers: builder.query<Shipper[], void>({
			query: () => "shippers/",
			providesTags: ["Shipper"],
		}),

		getShipperById: builder.query<Shipper, string>({
			query: (shipperId) => `shippers/${shipperId}`,
			providesTags: ["Shipper"],
		}),

		getShipperOrders: builder.query<Order[], string>({
			query: (shipperId) => `shippers/${shipperId}/orders`,
			providesTags: ["Shipper"],
		}),

		createShipper: builder.mutation<Shipper, CreateShipperDTO>({
			query: (newShipper) => ({
				url: "shippers/",
				method: "POST",
				body: newShipper,
			}),
			invalidatesTags: ["Shipper"],
		}),

		updateShipper: builder.mutation<
			Shipper,
			{ shipperId: string; updateData: UpdateShipperDTO }
		>({
			query: ({ shipperId, updateData }) => ({
				url: `shippers/${shipperId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Shipper"],
		}),

		updateShipperLocation: builder.mutation<
			Shipper,
			{ shipperId: string; locationX: number; locationY: number }
		>({
			query: ({ shipperId, locationX, locationY }) => ({
				url: `shippers/${shipperId}/location`,
				method: "PUT",
				body: { locationX, locationY },
			}),
			invalidatesTags: ["Shipper"],
		}),

		deleteShipper: builder.mutation<{ message: string }, string>({
			query: (shipperId) => ({
				url: `shippers/${shipperId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Shipper"],
		}),
	}),
});

export const {
	useGetAllShippersQuery,
	useGetShipperByIdQuery,
	useGetShipperOrdersQuery,
	useCreateShipperMutation,
	useUpdateShipperMutation,
	useUpdateShipperLocationMutation,
	useDeleteShipperMutation,
} = shipperApi;
