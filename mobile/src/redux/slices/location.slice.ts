import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LocationStateType = {
	latitude: number | null;
	longitude: number | null;
	error: string | null;
};

const initialState: LocationStateType = {
	latitude: null,
	longitude: null,
	error: null,
};

const locationSlice = createSlice({
	name: "location",
	initialState,
	reducers: {
		setLocation: (
			state,
			action: PayloadAction<{ latitude: number; longitude: number }>
		) => {
			state.latitude = action.payload.latitude;
			state.longitude = action.payload.longitude;
			state.error = null;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},
		clearLocation: (state) => {
			state.latitude = null;
			state.longitude = null;
			state.error = null;
		},
	},
});

export const { setLocation, setError, clearLocation } = locationSlice.actions;

export const computeDistance = (
	state: LocationStateType,
	point: { latitude: number; longitude: number }
): number | null => {
	if (state.latitude === null || state.longitude === null) {
		return null;
	}

	const toRadians = (degrees: number) => degrees * (Math.PI / 180);

	const R = 6371; // Radius of the Earth in kilometers
	const dLat = toRadians(point.latitude - state.latitude);
	const dLon = toRadians(point.longitude - state.longitude);
	const lat1 = toRadians(state.latitude);
	const lat2 = toRadians(point.latitude);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(lat1) *
			Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c; // Distance in kilometers rounded to 2 decimals
	// Distance rounded to two decimals
	return Math.round(distance * 100) / 100;
};

export default locationSlice.reducer;
