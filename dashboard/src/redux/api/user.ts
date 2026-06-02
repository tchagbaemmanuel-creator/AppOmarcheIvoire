import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "./order";
import { GiftCard } from "./giftcard";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface User {
	userId: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	city: string;
	address: string;
	phone: string;
	createdAt: Date;
	updatedAt: Date;
	orders?: Order[];
	giftCard?: GiftCard;
}

export interface CreateUserDTO {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	city?: string;
	address: string;
	phone: string;
}

export interface UpdateUserDTO {
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	city?: string;
	address?: string;
	phone?: string;
}

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: baseQuery,
	tagTypes: ["User"],
	endpoints: (builder) => ({
		getAllUsers: builder.query<User[], void>({
			query: () => "users/",
			providesTags: ["User"],
		}),

		getUserById: builder.query<User, string>({
			query: (userId) => `users/${userId}`,
			providesTags: ["User"],
		}),

		getUserOrders: builder.query<Order[], string>({
			query: (userId) => `users/${userId}/orders`,
			providesTags: ["User"],
		}),

		createUser: builder.mutation<User, CreateUserDTO>({
			query: (newUser) => ({
				url: "users/",
				method: "POST",
				body: newUser,
			}),
			invalidatesTags: ["User"],
		}),

		updateUser: builder.mutation<
			User,
			{ userId: string; updateData: UpdateUserDTO }
		>({
			query: ({ userId, updateData }) => ({
				url: `users/${userId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["User"],
		}),

		deleteUser: builder.mutation<{ message: string }, string>({
			query: (userId) => ({
				url: `users/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["User"],
		}),
	}),
});

export const {
	useGetAllUsersQuery,
	useGetUserByIdQuery,
	useGetUserOrdersQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;
