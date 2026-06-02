import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeliveryState {
	currentOrderId: string | null;
}

export interface WebSocketMessage {
	type: string;
	orderId: string;
}

const initialState: DeliveryState = {
	currentOrderId: null,
};

const deliverySlice = createSlice({
	name: "delivery",
	initialState,
	reducers: {
		setCurrentOrderId: (state, action: PayloadAction<string | null>) => {
			state.currentOrderId = action.payload;
		},
	},
});

export const { setCurrentOrderId } = deliverySlice.actions;

export default deliverySlice.reducer;
