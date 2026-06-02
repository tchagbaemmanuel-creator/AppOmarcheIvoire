import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./user";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface GiftCard {
	giftCardId: string;
	userId?: string;
	expiration: Date;
	status: string;
	createdAt?: Date;
	updatedAt: Date;
	user?: User;
}

export interface CreateGiftCardDTO {
	userId: string;
	expiration: string;
	status: "IDLE" | "USED" | "EXPIRED";
}

export interface UpdateGiftCardDTO {
	userId?: string;
	expiration?: string;
	status?: "IDLE" | "USED" | "EXPIRED";
}

export interface AssignGiftCardDTO {
	userId: string;
}

export const giftCardApi = createApi({
	reducerPath: "giftCardApi",
	baseQuery: baseQuery,
	tagTypes: ["GiftCard"],
	endpoints: (builder) => ({
		getAllGiftCards: builder.query<GiftCard[], void>({
			query: () => "giftcards/",
			providesTags: ["GiftCard"],
		}),

		getGiftCardById: builder.query<GiftCard, string>({
			query: (giftCardId) => `giftcards/${giftCardId}`,
			providesTags: ["GiftCard"],
		}),

		createGiftCard: builder.mutation<GiftCard, CreateGiftCardDTO>({
			query: (newGiftCard) => ({
				url: "giftcards/",
				method: "POST",
				body: newGiftCard,
			}),
			invalidatesTags: ["GiftCard"],
		}),

		updateGiftCard: builder.mutation<
			GiftCard,
			{ giftCardId: string; updateData: UpdateGiftCardDTO }
		>({
			query: ({ giftCardId, updateData }) => ({
				url: `giftcards/${giftCardId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["GiftCard"],
		}),

		deleteGiftCard: builder.mutation<{ message: string }, string>({
			query: (giftCardId) => ({
				url: `giftcards/${giftCardId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["GiftCard"],
		}),

		assignGiftCard: builder.mutation<
			GiftCard,
			{ giftCardId: string; assignData: AssignGiftCardDTO }
		>({
			query: ({ giftCardId, assignData }) => ({
				url: `giftcards/${giftCardId}/assign`,
				method: "POST",
				body: assignData,
			}),
			invalidatesTags: ["GiftCard"],
		}),
	}),
});

export const {
	useGetAllGiftCardsQuery,
	useGetGiftCardByIdQuery,
	useCreateGiftCardMutation,
	useUpdateGiftCardMutation,
	useDeleteGiftCardMutation,
	useAssignGiftCardMutation,
} = giftCardApi;
