import { Context, Next } from "hono";
import { ENV } from "@/config/constants";
import jwt from "jsonwebtoken";
import AppError from "@/utils/AppError";
import { Admin, Agent, Shipper, User } from "@prisma/client";
import prisma from "@prisma/index";

type JWTPayload = {
  userId?: string;
  agentId?: string;
  shipperId?: string;
  adminId?: string;
  iat: number;
  exp: number;
};

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Non autorisé", 401, new Error("No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;

    let user: User | Agent | Shipper | Admin | null = null;

    if (decoded.userId) {
      user = await prisma.user.findUnique({
        where: { userId: decoded.userId },
      });
    } else if (decoded.agentId) {
      user = await prisma.agent.findUnique({
        where: { agentId: decoded.agentId },
      });
    } else if (decoded.shipperId) {
      user = await prisma.shipper.findUnique({
        where: { shipperId: decoded.shipperId },
      });
    } else if (decoded.adminId) {
      user = await prisma.admin.findUnique({
        where: { adminId: decoded.adminId },
      });

      if (user) {
        c.set("areaCode", user.areaCode);
      }
    }

    if (!user) {
      throw new AppError("Non autorisé", 401, new Error("User not found"));
    }

    // Pour l'app mobile côté client, seul `userId` est requis ici.
    // (agent/shipper/admin ont leurs propres ids dans le JWT)
    if (decoded.userId) {
      c.set("userId", decoded.userId);
    }

    // Add user to context variables
    await next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Non autorisé", 401, error);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Erreur lors de l'authentification",
      500,
      error as Error
    );
  }
}

export function roleGuard(...roles: string[]) {
  return async function (c: Context, next: Next) {
    const user = c.get("user") as User | Agent | Shipper | Admin;

    if (!user || !("role" in user)) {
      throw new AppError("Non autorisé", 401, new Error("No role found"));
    }

    await next();
  };
}
