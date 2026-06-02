import { Context } from "hono";
import { Prisma } from "@prisma/client";
import AppError from "../utils/AppError";
import { StatusCode } from "hono/utils/http-status";

function logUnhandled(err: unknown) {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		console.error("[Prisma]", err.code, err.message, JSON.stringify(err.meta));
		return;
	}
	if (err instanceof Prisma.PrismaClientInitializationError) {
		console.error("[Prisma init]", err.message);
		return;
	}
	if (err instanceof Prisma.PrismaClientRustPanicError) {
		console.error("[Prisma]", err.message);
		return;
	}
	if (err instanceof Error) {
		console.error("[Error]", err.name, err.message, err.stack);
		return;
	}
	console.error("Unhandled error:", err);
}

function messageForPrismaKnown(err: Prisma.PrismaClientKnownRequestError): {
	message: string;
	status: number;
} | null {
	switch (err.code) {
		case "P2021":
			return {
				message:
					"Schéma base de données incomplet : exécutez les migrations Prisma (table manquante).",
				status: 503,
			};
		case "P1001":
			return {
				message: "Impossible de joindre la base de données.",
				status: 503,
			};
		default:
			return null;
	}
}

const errorHandler = (err: any, c: Context) => {
	if (err instanceof AppError) {
		if (err.statusCode == 500) console.error("AppError:", err);
		return c.json(
			{
				status: "error",
				message: err.message,
				code: err.statusCode,
			},
			err.statusCode as StatusCode
		);
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		logUnhandled(err);
		const mapped = messageForPrismaKnown(err);
		if (mapped) {
			return c.json(
				{
					status: "error",
					message: mapped.message,
					code: mapped.status,
				},
				mapped.status as StatusCode
			);
		}
	}

	logUnhandled(err);

	const exposeDetail =
		process.env.NODE_ENV !== "production" && err instanceof Error;
	return c.json(
		{
			status: "error",
			message: exposeDetail
				? `${err.message}`
				: "An unexpected error occurred",
			code: 500,
		},
		500
	);
};

export default errorHandler;
