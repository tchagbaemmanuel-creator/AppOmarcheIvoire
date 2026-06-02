import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "info" | "warning";

export type ToastStateType = {
	message: string;
	type: ToastType;
	visible: boolean;
};

const initialState: ToastStateType = {
	message: "",
	type: "info",
	visible: false,
};

const toastSlice = createSlice({
	name: "toast",
	initialState,
	reducers: {
		showToast: (
			state,
			action: PayloadAction<{ message: string; type: ToastType }>
		) => {
			state.message = action.payload.message;
			state.type = action.payload.type;
			state.visible = true;
		},
		hideToast: (state) => {
			state.visible = false;
		},
	},
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
