import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "./order";
import { Market, AreaCode } from "./market";
import { baseQuery } from "./baseApi";

export interface Agent {
	agentId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	marketId: string;
	pictureUrl?: string;
	market: Market;
	createdAt: Date;
	updatedAt: Date;
	orders?: Order[];
}

export interface CreateAgentDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	marketId: string;
	pictureUrl?: string;
}

export interface UpdateAgentDTO {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	phone?: string;
	market?: {
		connect: {
			marketId: string;
		};
	};
	pictureUrl?: string;
}

export const agentApi = createApi({
	reducerPath: "agentApi",
	baseQuery: baseQuery,
	tagTypes: ["Agent"],
	endpoints: (builder) => ({
		getAllAgents: builder.query<Agent[], AreaCode | undefined>({
			query: (areaCode) => areaCode ? `agents/?areaCode=${areaCode}` : "agents/",
			providesTags: ["Agent"],
		}),

		getAgentById: builder.query<Agent, string>({
			query: (agentId) => `agents/${agentId}`,
			providesTags: ["Agent"],
		}),

		getOrdersFromAgent: builder.query<Order[], string>({
			query: (agentId) => `agents/${agentId}/orders`,
			providesTags: ["Agent"],
		}),

		createAgent: builder.mutation<Agent, CreateAgentDTO>({
			query: (newAgent) => ({
				url: "agents/",
				method: "POST",
				body: newAgent,
			}),
			invalidatesTags: ["Agent"],
		}),

		updateAgent: builder.mutation<
			Agent,
			{ agentId: string; updateData: UpdateAgentDTO }
		>({
			query: ({ agentId, updateData }) => ({
				url: `agents/${agentId}`,
				method: "PATCH",
				body: updateData,
			}),
			invalidatesTags: ["Agent"],
		}),

		deleteAgent: builder.mutation<void, string>({
			query: (agentId) => ({
				url: `agents/${agentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Agent"],
		}),
	}),
});

export const {
	useGetAllAgentsQuery,
	useGetAgentByIdQuery,
	useGetOrdersFromAgentQuery,
	useCreateAgentMutation,
	useUpdateAgentMutation,
	useDeleteAgentMutation,
} = agentApi;
