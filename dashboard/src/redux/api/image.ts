import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ImageUploadResponse {
    id: string;
    url: string;
    name: string;
    size: number;
    type: string;
}

export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: baseQuery,
    tagTypes: ["Image"],
    endpoints: (builder) => ({
        uploadImage: builder.mutation<ImageUploadResponse, FormData>({
            query: (formData) => ({
                url: "images/upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Image"],
        }),
        deleteImage: builder.mutation<{ message: string }, string>({
            query: (imageId) => ({
                url: `images/${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Image"],
        }),
    }),
});

export const {
    useUploadImageMutation,
    useDeleteImageMutation,
} = imageApi;
