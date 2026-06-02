import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/features/auth/redux/baseApi";

export enum ProductCategory {
    Legumes = "Legumes",
    Fruits = "Fruits",
    Viandes = "Viandes",
    Poissons = "Poissons",
    Cereales = "Cereales",
    Tubercules = "Tubercules",
    Mer = "Mer",
    Epices = "Epices",
    Autres = "Autres"
}

export enum ProductUnit {
    KG = "KG",
    DEMI_KG = "DEMI_KG",
    LITRE = "LITRE",
    TAS = "TAS",
    SAC = "SAC",
    BOITE = "BOITE",
    MORCEAUX = "MORCEAUX",
    UNIT = "UNIT",
    AUTRE = "AUTRE"
}

export type Product = {
    productId: string;
    pictureUrl: string[];
    name: string;
    description: string | null;
    unit: ProductUnit;
    amount: number;
    price: number;
    category: ProductCategory;
    sellerId: string;
    isInStock: boolean;
    createdAt: string | null;
    updatedAt: string;
    orderProducts?: Array<{
        orderProductId: string;
        orderId: string;
        quantity: number;
        createdAt: string | null;
        updatedAt: string;
    }>;
};

export type UpdateProductDTO = Partial<Omit<Product, "productId" | "sellerId">>;
export type CreateProductDTO = {
    name: string;
    description: string | null;
    unit: ProductUnit;
    amount: number;
    price: number;
    category: ProductCategory;
    pictureUrl: string[];
    sellerId: string;
    isInStock?: boolean;
};

export interface ProductDetails extends Product {
    // ... existing type definition
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({
                url: "/products/",
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        fetchProductById: builder.query<ProductDetails, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        fetchProductsByCategory: builder.query<
            Product[],
            ProductCategory
        >({
            query: (category) => ({
                url: `/products/category/${category}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        fetchProductsBySellerId: builder.query<Product[], string>({
            query: (sellerId) => ({
                url: `/products/seller/${sellerId}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<Product, CreateProductDTO>({
            query: (body) => ({
                url: "/products/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<
            Product,
            { productId: string; body: UpdateProductDTO }
        >({
            query: ({ productId, body }) => ({
                url: `/products/${productId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<void, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});

export const {
    useFetchProductsQuery,
    useFetchProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;

export default productApi;
