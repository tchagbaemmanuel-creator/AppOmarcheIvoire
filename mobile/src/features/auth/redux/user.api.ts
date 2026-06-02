import { ENV } from "@/config/constants";
import { GiftCard } from "@/features/(client)/redux/giftCardApi.slice";
import { Order } from "@/features/(client)/redux/ordersApi.slice";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

export interface User {
	userId: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	city: string;
	address: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
}

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery,
	endpoints: (builder) => ({
		fetchUsers: builder.query<User[], void>({
			query: () => ({
				url: "/users",
				method: "GET",
			}),
		}),
		fetchOrdersByUserId: builder.query<Order[], string>({
			query: (userId) => ({
				url: `/users/${userId}/orders`,
				method: "GET",
			}),
		}),
		fetchGiftCardByUserId: builder.query<GiftCard | undefined, string>({
			query: (userId) => ({
				url: `/users/${userId}/gift-card`,
				method: "GET",
			}),
		}),
		changeMyPassword: builder.mutation<
			{ message: string },
			{ currentPassword: string; newPassword: string }
		>({
			query: (body) => ({
				url: `/users/me/password`,
				method: "PUT",
				body,
			}),
		}),
	}),
});

export const {
	useFetchUsersQuery,
	useFetchOrdersByUserIdQuery,
	useFetchGiftCardByUserIdQuery,
	useChangeMyPasswordMutation,
} = usersApi;

export default usersApi;
