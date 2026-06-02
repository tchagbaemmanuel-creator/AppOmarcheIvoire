import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "./product";
import { User } from "./user";
import { Agent } from "./agent";
import { Shipper } from "./shipper";
import { PromoCode } from "./promocode";
import { baseQuery } from "./baseApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface OrderDTO {
    order: Order;
    orderProducts: {
        sellerName: string;
        sellerTableNo: number;
        product: Product;
        quantity: number;
    }[];
    marketName: string;
}

export type OrderStatus =
    | "IDLE"
    | "PROCESSING"
    | "PROCESSED"
    | "COLLECTING"
    | "DELIVERING"
    | "DELIVERED"
    | "CANCELED";

export interface Order {
    orderId: string;
    userId: string;
    locationX: number;
    locationY: number;
    agentId?: string;
    shipperId?: string;
    address: string;
    deliveryTime: string;
    paymentMethod: string;
    promoCodeId?: string;
    status: OrderStatus;
    cancellationReason?: string;
    users: User;
    shipper?: Shipper;
    agent?: Agent;
    orderProducts: OrderProducts[];
    promoCode?: PromoCode;
    createdAt?: Date;
    updatedAt: Date;
}

export interface OrderProducts {
    orderProductId: string;
    orderId: string;
    productId: string;
    quantity: number;
    products: Product;
    orders: Order;
    createdAt?: Date;
    updatedAt: Date;
}

export interface CreateOrderDTO {
    order: {
        userId: string;
        locationX: number;
        locationY: number;
        address: string;
        deliveryTime: string;
        paymentMethod: string;
        promoCodeId?: string;
        status:
            | "IDLE"
            | "PROCESSING"
            | "PROCESSED"
            | "COLLECTING"
            | "DELIVERING"
            | "DELIVERED"
            | "CANCELED";
    };
    orderProducts: OrderProducts[];
}

export interface UpdateOrderDTO {
    locationX?: number;
    locationY?: number;
    agentId?: string;
    shipperId?: string;
    address?: string;
    deliveryTime?: string;
    paymentMethod?: string;
    promoCodeId?: string;
    status?: OrderStatus;
    cancellationReason?: string;
}

export interface UpdateOrderStatusDTO {
    type: "agent" | "shipper" | "admin";
    userId: string;
    status:
        | "IDLE"
        | "PROCESSING"
        | "PROCESSED"
        | "COLLECTING"
        | "DELIVERING"
        | "DELIVERED"
        | "CANCELED";
    cancellationReason?: string;
}

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQuery,
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        getAllOrders: builder.query<OrderDTO[], string | undefined>({
            query: (areaCode) => `orders/${areaCode ? `?a=${areaCode}` : ""}`,
            providesTags: ["Order"],
        }),

        getOrderById: builder.query<OrderDTO, string>({
            query: (orderId) => `orders/${orderId}`,
            providesTags: ["Order"],
        }),

        getOrderProducts: builder.query<OrderProducts[], string>({
            query: (orderId) => `orders/${orderId}/order-products`,
            providesTags: ["Order"],
        }),

        getOrderDetails: builder.query<Order, string>({
            query: (orderId) => `orders/${orderId}/details`,
            providesTags: ["Order"],
        }),

        createOrder: builder.mutation<Order, CreateOrderDTO>({
            query: (newOrder) => ({
                url: "orders/",
                method: "POST",
                body: newOrder,
            }),
            invalidatesTags: ["Order"],
        }),

        updateOrder: builder.mutation<
            Order,
            { orderId: string; updateData: UpdateOrderDTO }
        >({
            query: ({ orderId, updateData }) => ({
                url: `orders/${orderId}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: ["Order"],
        }),

        updateOrderStatus: builder.mutation<
            Order,
            { orderId: string; updateData: UpdateOrderStatusDTO }
        >({
            query: ({ orderId, updateData }) => ({
                url: `orders/${orderId}/status`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: ["Order"],
        }),

        deleteOrder: builder.mutation<{ message: string }, string>({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useGetOrderProductsQuery,
    useGetOrderDetailsQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation,
} = orderApi;
