import { Hono } from "hono";
import { z } from "zod";
import { Agent } from "@prisma/client";
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgentById,
  deleteAgentById,
  getAgentOrders,
} from "@/services/agent.service";
import AppError from "@/utils/AppError";
import { AreaCodeQueryValidator } from "./market.handler";

const agentHandler = new Hono();

const AgentSchema = z.object({
  agentId: z.string().uuid(),
  pictureUrl: z.string().nullable(),
  marketId: z.string().uuid(),
  email: z.string().email().nullable(),
  password: z.string(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().min(1).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CreateAgentSchema = AgentSchema.omit({
  agentId: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateAgentSchema = AgentSchema.partial().omit({
  agentId: true,
  createdAt: true,
  updatedAt: true,
});

// Get all agents
agentHandler.get("/", async (c) => {
  try {
    const query = c.req.query();
    const areaCode = AreaCodeQueryValidator.parse({
      areaCode: query.areaCode,
    }).a;
    const agents = await getAllAgents(areaCode);
    return c.json(agents);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          error: error.error,
        },
        error.statusCode
      );
    }
    throw error;
  }
});

// Get agent by ID
agentHandler.get("/:agentId", async (c) => {
  try {
    const { agentId } = c.req.param();
    const agent = await getAgentById(agentId);
    if (!agent) {
      return c.json(
        {
          message: "Agent not found",
          statusCode: 404,
          isOperational: true,
          error: null,
        },
        404
      );
    }
    return c.json(agent);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          error: error.error,
        },
        error.statusCode
      );
    }
    throw error;
  }
});

// Get agent orders
agentHandler.get("/:agentId/orders", async (c) => {
  try {
    const { agentId } = c.req.param();
    const orders = await getAgentOrders(agentId);
    return c.json(orders);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          status: error.statusCode,
        },
        error.statusCode
      );
    }
    return c.json({ message: "Internal server error", status: 500 }, 500);
  }
});

// Create agent
agentHandler.post("/", async (c) => {
  try {
    const data = await c.req.json();
    const validatedData = CreateAgentSchema.parse(data);
    const agent = await createAgent(validatedData);
    return c.json(agent, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          error: error.error,
        },
        error.statusCode
      );
    }
    throw error;
  }
});

// Update agent
agentHandler.patch("/:agentId", async (c) => {
  try {
    const { agentId } = c.req.param();
    const data = await c.req.json();
    const validatedData = UpdateAgentSchema.parse(data);
    const agent = await updateAgentById(agentId, validatedData);
    return c.json(agent);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          error: error.error,
        },
        error.statusCode
      );
    }
    throw error;
  }
});

// Delete agent
agentHandler.delete("/:agentId", async (c) => {
  try {
    const { agentId } = c.req.param();
    await deleteAgentById(agentId);
    return c.body(null, 204);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json(
        {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          error: error.error,
        },
        error.statusCode
      );
    }
    throw error;
  }
});

export default agentHandler;
