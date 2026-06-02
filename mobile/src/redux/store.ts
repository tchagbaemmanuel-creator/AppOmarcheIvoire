import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/redux/auth.slice";
import toastReducer from "@/redux/slices/toast.slice";
import locationReducer from "@/redux/slices/location.slice";
import deliveryReducer from "@/features/(shipper)/redux/delivery.slice";
import authApi from "@/features/auth/redux/auth.api";
import errorToastMiddleware from "./middleware/rtkErrorToaster";
import marketsApi from "@/features/(client)/redux/marketsApi.slice";
import productApi from "@/features/(client)/redux/productsApi.slice";
import cartReducer from "@/features/(client)/redux/cart.slice";
import devtoolsEnhancer from "redux-devtools-expo-dev-plugin";
import { ordersApi } from "@/features/(client)/redux/ordersApi.slice";
import usersApi from "@/features/auth/redux/user.api";
import sellersApi from "@/features/(client)/redux/sellersApi.slice";
import agentsApi from "@/features/auth/redux/agent.api";
import shippersApi from "@/features/auth/redux/shipper.api";
import { promoCodeApi } from "@/features/(client)/redux/promoCodeApi.slice";
import {giftCardApi} from "@/features/(client)/redux/giftCardApi.slice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		toast: toastReducer,
		delivery: deliveryReducer,
		location: locationReducer,
		cart: cartReducer,
		[authApi.reducerPath]: authApi.reducer,
		[marketsApi.reducerPath]: marketsApi.reducer,
		[agentsApi.reducerPath]: agentsApi.reducer,
		[shippersApi.reducerPath]: shippersApi.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
		[usersApi.reducerPath]: usersApi.reducer,
		[sellersApi.reducerPath]: sellersApi.reducer,
		[promoCodeApi.reducerPath]: promoCodeApi.reducer,
		[giftCardApi.reducerPath]: giftCardApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			immutableCheck: {
				// Reduce noisy performance warnings in Expo dev mode.
				warnAfter: 128,
			},
		}).concat(
			authApi.middleware,
			marketsApi.middleware,
			productApi.middleware,
			ordersApi.middleware,
			usersApi.middleware,
			sellersApi.middleware,
			agentsApi.middleware,
			shippersApi.middleware,
			promoCodeApi.middleware,
			giftCardApi.middleware,
			errorToastMiddleware
		),
	enhancers: (defaultEnhancers) =>
		defaultEnhancers().concat(devtoolsEnhancer()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
