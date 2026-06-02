import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const connectedShippers = new Map<string, ServerWebSocket>();
const connectedClients = new Map<string, ServerWebSocket>();

export type ClientSocketEvent =
	| { type: "ORDER_CREATED"; orderId: string }
	| { type: "ORDER_STATUS_UPDATED"; orderId: string; status: string };

export function setupWebSocket(app: Hono) {
	const { upgradeWebSocket, websocket } = createBunWebSocket();

	app.get(
		"/ws/:shipperId",
		upgradeWebSocket((c) => ({
			onOpen: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const shipperId = c.req.param("shipperId");
				s.subscribe(shipperId);
				connectedShippers.set(shipperId, s);
				console.log(
					`Shipper ${shipperId} connected`,
					connectedShippers.size
				);
			},
			onClose: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const shipperId = c.req.param("shipperId");
				s.unsubscribe(shipperId);
				connectedShippers.delete(shipperId);
				console.log(
					`Shipper ${shipperId} disconnected`,
					connectedShippers.size
				);
			},
		}))
	);

	app.get(
		"/ws/client/:userId",
		upgradeWebSocket((c) => ({
			onOpen: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const userId = c.req.param("userId");
				s.subscribe(userId);
				connectedClients.set(userId, s);
				console.log(`Client ${userId} connected`, connectedClients.size);
			},
			onClose: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const userId = c.req.param("userId");
				s.unsubscribe(userId);
				connectedClients.delete(userId);
				console.log(`Client ${userId} disconnected`, connectedClients.size);
			},
		}))
	);

	return websocket;
}

export function sendClientEvent(userId: string, payload: ClientSocketEvent) {
	const userWs = connectedClients.get(userId);
	if (!userWs) return;
	userWs.send(JSON.stringify(payload));
}

export { connectedShippers };
