import prisma from "@prisma/index";
import { connectedShippers } from "../websocket";

export async function assignOrdersToShippers() {
	try {
		const unassignedOrders = await prisma.order.findMany({
			where: {
				status: "PROCESSED",
				shipperId: null,
			},
		});

		if (unassignedOrders.length === 0) {
			return;
		}

		const availableShippers = Array.from(connectedShippers.keys());

		if (availableShippers.length === 0) {
			return;
		}

		for (const order of unassignedOrders) {
			const availableShipper = await findAvailableShipper(
				availableShippers
			);

			if (availableShipper) {
				await prisma.order.update({
					where: { orderId: order.orderId },
					data: { shipperId: availableShipper },
				});

				const shipperWs = connectedShippers.get(availableShipper);
				if (shipperWs) {
					shipperWs.send(
						JSON.stringify({
							type: "NEW_ORDER",
							orderId: order.orderId,
						})
					);
				}

				console.log(
					`Assigned order ${order.orderId} to shipper ${availableShipper}`
				);
			} else {
				console.log(`No available shipper for order ${order.orderId}`);
			}
		}
	} catch (error) {
		console.error("Error assigning orders to shippers:", error);
	}
}

async function findAvailableShipper(
	availableShippers: string[]
): Promise<string | null> {
	for (const shipperId of availableShippers) {
		const assignedOrder = await prisma.order.findFirst({
			where: {
				shipperId: shipperId,
				status: {
					in: ["PROCESSED", "COLLECTING", "DELIVERING"],
				},
			},
		});

		if (!assignedOrder) {
			return shipperId;
		}
	}

	return null;
}

export async function sendCurrentOrderToShipper() {
	try {
		const activeOrders = await prisma.order.findMany({
			where: {
				status: {
					in: ["PROCESSED", "COLLECTING", "DELIVERING"],
				},
				shipperId: {
					not: null,
				},
			},
			select: {
				orderId: true,
				shipperId: true,
			},
		});

		for (const order of activeOrders) {
			const shipperWs = connectedShippers.get(order.shipperId!);
			if (shipperWs) {
				shipperWs.send(
					JSON.stringify({
						type: "CURRENT_ORDER",
						orderId: order.orderId,
					})
				);
			}
		}
	} catch (error) {
		console.error("Error sending current orders to shippers:", error);
	}
}
