import {
  selectAllAgents,
  selectAgentById,
  updateAgentById as updateAgent,
  deleteAgentById as deleteAgent,
  selectAgentOrders,
} from "@/repositories/agent.repository";
import AppError from "@/utils/AppError";
import { Agent, Prisma, area_code } from "@prisma/client";
import prisma from "@prisma/index";

export async function getAllAgents(areaCode?: area_code): Promise<Agent[]> {
  try {
    return await selectAllAgents(areaCode);
  } catch (error) {
    throw new AppError("Failed to fetch agents", 500, error as Error);
  }
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  try {
    return await selectAgentById(agentId);
  } catch (error) {
    throw new AppError("Failed to fetch agent", 500, error as Error);
  }
}

export async function createAgent(data: Omit<Agent, "agentId" | "createdAt" | "updatedAt">): Promise<Omit<Agent, "password">> {
  try {
    const hashedPassword = await Bun.password.hash(data.password);
    const agent = await prisma.agent.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    
    const { password, ...agentWithoutPassword } = agent;
    return agentWithoutPassword;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Agent with this email already exists", 400, error);
      }
    }
    throw new AppError("Failed to create agent", 500, error as Error);
  }
}

export async function updateAgentById(
  agentId: string,
  data: Partial<Omit<Agent, "agentId" | "createdAt" | "updatedAt">>
): Promise<Agent> {
  try {
    if (data.password) {
      data.password = await Bun.password.hash(data.password);
    }
    return await updateAgent(agentId, data);
  } catch (error) {
    throw new AppError("Failed to update agent", 500, error as Error);
  }
}

export async function deleteAgentById(agentId: string): Promise<void> {
  try {
    await deleteAgent(agentId);
  } catch (error) {
    throw new AppError("Failed to delete agent", 500, error as Error);
  }
}

export async function getAgentOrders(agentId: string) {
  try {
    return await selectAgentOrders(agentId);
  } catch (error) {
    throw new AppError("Failed to fetch agent orders", 500, error as Error);
  }
}
