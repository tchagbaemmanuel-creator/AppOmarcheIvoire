import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./user.api";
import { Agent } from "./agent.api";
import { Shipper } from "./shipper.api"; // Import Shipper

export type AuthStateType = {
	user: User | Agent | Shipper | undefined; // Include Shipper
	role: "Client" | "Agent" | "Livreur"; // Add Shipper role
	token: string;
};

const initialState: AuthStateType = {
	user: undefined,
	role: "Client",
	token: "",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		changeRole: (state, action: PayloadAction<AuthStateType["role"]>) => {
			state.role = action.payload;
		},
		logIn: (state, action: PayloadAction<Omit<AuthStateType, "role">>) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		logOut: (state) => {
			state.user = undefined;
			state.role = "Client";
			state.token = "";
		},
	},
});

export const { changeRole, logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
