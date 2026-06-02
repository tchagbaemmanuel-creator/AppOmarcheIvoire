import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductDetails } from "./productsApi.slice";

export type CartItemType = {
	product: Product;
	quantity: number;
};

export type CartState = Record<string, CartItemType[]>;

const initialState: CartState = {};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItemToCart: (
			state,
			action: PayloadAction<{
				marketId: string;
				product: ProductDetails;
				quantity: number;
			}>
		) => {
			const { marketId, product, quantity } = action.payload;
			const cartList = state[marketId] || (state[marketId] = []);
			const existingItem = cartList.find(
				(item) => item.product.productId === product.productId
			);

			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				cartList.push({
					product: { ...product, sellerId: product.sellerId },
					quantity,
				});
			}
		},
		updateItemQuantity: (
			state,
			action: PayloadAction<{
				marketId: string;
				productId: string;
				quantity: number;
			}>
		) => {
			const { marketId, productId, quantity } = action.payload;
			const cartList = state[marketId];
			if (!cartList) return;

			const existingItem = cartList.find(
				(item) => item.product.productId === productId
			);

			if (existingItem) {
				existingItem.quantity = quantity;
			}
		},
		removeItemFromCart: (
			state,
			action: PayloadAction<{ marketId: string; productId: string }>
		) => {
			const { marketId, productId } = action.payload;
			const cartList = state[marketId];
			if (!cartList) return;

			const itemIndex = cartList.findIndex(
				(item) => item.product.productId === productId
			);

			if (itemIndex !== -1) {
				cartList.splice(itemIndex, 1);
			}
		},
		clearCart: (state, action: PayloadAction<{ marketId: string }>) => {
			const { marketId } = action.payload;
			delete state[marketId];
		},
	},
});

export const {
	addItemToCart,
	updateItemQuantity,
	removeItemFromCart,
	clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
