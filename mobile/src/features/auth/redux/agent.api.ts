import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

export interface Agent {
	agentId: string;
	marketId: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export const agentsApi = createApi({
	reducerPath: "agentsApi",
	baseQuery,
	endpoints: (builder) => ({
		fetchAgentById: builder.query<Agent, string>({
			query: (agentId) => ({
				url: `/agents/${agentId}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useFetchAgentByIdQuery } = agentsApi;

export default agentsApi;
