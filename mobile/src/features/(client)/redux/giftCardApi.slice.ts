import { ENV } from "@/config/constants";
import { baseQuery } from "@/features/auth/redux/baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export type GiftCard = {
	giftCardId: string;
	userId: string | null;
	expiration: string;
	status: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateGiftCardDTO = {
	userId: string | null;
	expiration: string;
};

export type UpdateGiftCardDTO = Partial<CreateGiftCardDTO>;

export type AssignGiftCardDTO = {
	userId: string;
};

export const giftCardApi = createApi({
	reducerPath: "giftCardApi",
	baseQuery: baseQuery,
	tagTypes: ["GiftCard"],
	endpoints: (builder) => ({
		fetchGiftCards: builder.query<GiftCard[], void>({
			query: () => ({
				url: "/giftcards/",
				method: "GET",
			}),
			providesTags: ["GiftCard"],
		}),
		fetchGiftCardById: builder.query<GiftCard, string>({
			query: (giftCardId) => ({
				url: `/giftcards/${giftCardId}`,
				method: "GET",
			}),
			providesTags: ["GiftCard"],
		}),
		createGiftCard: builder.mutation<GiftCard, CreateGiftCardDTO>({
			query: (body) => ({
				url: "/giftcards/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["GiftCard"],
		}),
		updateGiftCardById: builder.mutation<
			GiftCard,
			{ giftCardId: string; data: UpdateGiftCardDTO }
		>({
			query: ({ giftCardId, data }) => ({
				url: `/giftcards/${giftCardId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["GiftCard"],
		}),
		deleteGiftCardById: builder.mutation<void, string>({
			query: (giftCardId) => ({
				url: `/giftcards/${giftCardId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["GiftCard"],
		}),
		validateGiftCard: builder.query<GiftCard, string>({
			query: (code) => ({
				url: `/giftcards/validate/${code}`,
				method: "GET",
			}),
		}),
		useGiftCard: builder.mutation<void, string>({
			query: (giftCardId) => ({
				url: `/giftcards/${giftCardId}/use`,
				method: "POST",
			}),
			invalidatesTags: ["GiftCard"],
		}),
		assignGiftCard: builder.mutation<GiftCard, AssignGiftCardDTO & { giftCardId: string }>({
			query: ({ giftCardId, userId }) => ({
				url: `/giftcards/${giftCardId}/assign`,
				method: "POST",
				body: { userId },
			}),
			invalidatesTags: ["GiftCard"],
		}),
	})
});

export const {
	useFetchGiftCardsQuery,
	useFetchGiftCardByIdQuery,
	useCreateGiftCardMutation,
	useUpdateGiftCardByIdMutation,
	useDeleteGiftCardByIdMutation,
	useValidateGiftCardQuery,
	useUseGiftCardMutation,
	useAssignGiftCardMutation,
} = giftCardApi;