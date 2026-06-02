import { CartItemType } from "../redux/cart.slice";

export function getMarketCartTotal(cart: CartItemType[]): number {
	let total = 0;

	for (const item of cart) {
		total += item.product.price * item.quantity;
	}

	return total;
}
