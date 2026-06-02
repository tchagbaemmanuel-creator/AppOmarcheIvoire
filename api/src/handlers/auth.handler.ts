import { Hono } from "hono";
import {
	postLoginUser,
	postRegisterUser,
	postLoginAgent,
	postRegisterAgent,
	postLoginShipper,
	postRegisterShipper,
	postLoginAdmin,
	postRegisterAdmin,
	postForgotPasswordRequest,
} from "../services/auth.service";
import {
	approveForgotPasswordByToken,
	completeForgotPassword,
	getForgotPasswordStatus,
} from "../services/password-reset.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const UserLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const UserRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	address: z.string(),
});

const AgentLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const AgentRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	marketId: z.string().uuid(),
});

const ShipperLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const ShipperRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	marketId: z.string().uuid(),
});

const AdminLoginDTO = z.object({
	email: z.string(),
	password: z.string(),
});

const AdminRegisterDTO = z.object({
	email: z.string(),
	password: z.string(),
	// Si absent ou null => admin général (accès à tout)
	areaCode: z.string().optional().nullable(),
});

const ForgotPasswordDTO = z.object({
	phone: z.string(),
	role: z.enum(["Client", "Agent", "Shipper"]),
});

const authHandler = new Hono();

authHandler.post(
	"/forgot-password",
	zValidator("json", ForgotPasswordDTO),
	async (c) => {
		const { phone, role } = c.req.valid("json");
		const body = await postForgotPasswordRequest({ phone, role });
		return c.json(body);
	}
);

authHandler.get("/forgot-password/status/:requestId", async (c) => {
	const requestId = c.req.param("requestId");
	const body = await getForgotPasswordStatus(requestId);
	return c.json(body);
});

authHandler.get("/forgot-password/approve", async (c) => {
	const token = c.req.query("token") || "";
	const result = await approveForgotPasswordByToken(token);
	const page = (title: string, detail: string, ok: boolean) =>
		`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;color:#1a1a1a;}h1{font-size:1.25rem;}p{color:#525252;line-height:1.5;}</style></head><body><h1>${title}</h1><p>${detail}</p>${ok ? "<p>L'utilisateur peut maintenant définir un nouveau mot de passe dans l'application.</p>" : ""}</body></html>`;
	if (result.ok) {
		return c.html(
			page(
				"Réinitialisation autorisée",
				"La demande a bien été validée."
			),
			200
		);
	}
	return c.html(
		page("Action impossible", result.reason, false),
		400
	);
});

const ForgotPasswordCompleteDTO = z.object({
	requestId: z.string().uuid(),
	password: z.string().min(8),
});

authHandler.post(
	"/forgot-password/complete",
	zValidator("json", ForgotPasswordCompleteDTO),
	async (c) => {
		const { requestId, password } = c.req.valid("json");
		await completeForgotPassword({ requestId, newPassword: password });
		return c.json({ message: "Mot de passe mis à jour." });
	}
);

authHandler.post("/user/login", zValidator("json", UserLoginDTO), async (c) => {
	const { phone, password } = c.req.valid("json");
	const body = await postLoginUser({ phone, password });
	return c.json(body);
});

authHandler.post(
	"/user/register",
	zValidator("json", UserRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, address } =
			c.req.valid("json");
		await postRegisterUser({
			phone,
			password,
			firstName,
			lastName,
			address,
		});
		return c.json("Enregistrement réussi");
	}
);

authHandler.post(
	"/agent/login",
	zValidator("json", AgentLoginDTO),
	async (c) => {
		const { phone, password } = c.req.valid("json");
		const body = await postLoginAgent({ phone, password });
		return c.json(body);
	}
);

authHandler.post(
	"/agent/register",
	zValidator("json", AgentRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, marketId } =
			c.req.valid("json");
		const body = await postRegisterAgent({
			phone,
			password,
			firstName,
			lastName,
			marketId,
		});
		return c.json(body);
	}
);

authHandler.post(
	"/shipper/login",
	zValidator("json", ShipperLoginDTO),
	async (c) => {
		const { phone, password } = c.req.valid("json");
		const body = await postLoginShipper({ phone, password });
		return c.json(body);
	}
);

authHandler.post(
	"/shipper/register",
	zValidator("json", ShipperRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, marketId } =
			c.req.valid("json");
		const body = await postRegisterShipper({
			phone,
			password,
			firstName,
			lastName,
			marketId,
		});
		return c.json(body);
	}
);

authHandler.post("/admin/login", zValidator("json", AdminLoginDTO), async (c) => {
	const data = await c.req.json();
	const response = await postLoginAdmin(data);
	return c.json(response);
});

authHandler.post("/admin/register", zValidator("json", AdminRegisterDTO), async (c) => {
	const data = await c.req.json();
	const response = await postRegisterAdmin(data);
	return c.json(response);
});


export default authHandler;
