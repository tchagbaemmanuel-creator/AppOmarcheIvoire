import { PrismaClient } from "@prisma/client";
import { handleOrderCreated } from "./handlers/order-handlers";

const prisma = new PrismaClient().$extends({
	query: {
		order: {
			async create({ args, query }) {
				const order = await query(args);
				try {
					await handleOrderCreated(order);
				} catch (error) {
					console.error(
						"An error occurred while handling order created",
						error
					);
				}
				return order;
			},
		},
	},
});

export default prisma;
