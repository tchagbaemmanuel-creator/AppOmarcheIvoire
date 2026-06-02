import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

export interface Shipper {
	shipperId: string;
	marketId: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	pictureUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export const shippersApi = createApi({
	reducerPath: "shippersApi",
	baseQuery,
	endpoints: (builder) => ({
		fetchShipperById: builder.query<Shipper, string>({
			query: (shipperId) => ({
				url: `/shippers/${shipperId}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useFetchShipperByIdQuery } =
	shippersApi;

export default shippersApi;
