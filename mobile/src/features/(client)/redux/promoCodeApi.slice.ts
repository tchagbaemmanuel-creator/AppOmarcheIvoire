import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/features/auth/redux/baseApi";

export type PromoCode = {
  promoCodeId: string;
  code: string;
  expiration: string;
  discountType: "PERCENTAGE" | "FIXED";
  amount: number;
};

export type CreatePromoCodeDTO = Omit<PromoCode, "promoCodeId">;
export type UpdatePromoCodeDTO = Partial<CreatePromoCodeDTO>;

export const promoCodeApi = createApi({
  reducerPath: "promoCodeApi",
  baseQuery,
  tagTypes: ["PromoCode"],
  endpoints: (builder) => ({
    fetchPromoCodes: builder.query<PromoCode[], void>({
      query: () => ({
        url: "/promocodes/",
        method: "GET",
      }),
      providesTags: ["PromoCode"],
    }),
    fetchPromoCodeById: builder.query<PromoCode, string>({
      query: (promoCodeId) => ({
        url: `/promocodes/${promoCodeId}`,
        method: "GET",
      }),
      providesTags: ["PromoCode"],
    }),
    createPromoCode: builder.mutation<PromoCode, CreatePromoCodeDTO>({
      query: (body) => ({
        url: "/promocodes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PromoCode"],
    }),
    updatePromoCodeById: builder.mutation<
      PromoCode,
      { promoCodeId: string; data: UpdatePromoCodeDTO }
    >({
      query: ({ promoCodeId, data }) => ({
        url: `/promocodes/${promoCodeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PromoCode"],
    }),
    deletePromoCodeById: builder.mutation<void, string>({
      query: (promoCodeId) => ({
        url: `/promocodes/${promoCodeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PromoCode"],
    }),
    validatePromoCode: builder.mutation<PromoCode, string>({
      query: (code) => ({
        url: "/promocodes/validate",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["PromoCode"],
    }),
  }),
});

export const {
  useFetchPromoCodesQuery,
  useFetchPromoCodeByIdQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeByIdMutation,
  useDeletePromoCodeByIdMutation,
  useValidatePromoCodeMutation,
} = promoCodeApi;
