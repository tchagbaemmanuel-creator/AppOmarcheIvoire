import prisma from "@prisma/index";
import { Agent, area_code } from "@prisma/client";

export async function selectAllAgents(areaCode?: area_code): Promise<Agent[]> {
  return prisma.agent.findMany({
    where: areaCode ? {
      market: {
        areaCode
      }
    } : undefined,
    select: {
      agentId: true,
      pictureUrl: true,
      marketId: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      password: true,
    },
  });
}

export async function selectAgentById(agentId: string): Promise<Agent | null> {
  return prisma.agent.findUnique({
    where: { agentId },
    select: {
      agentId: true,
      pictureUrl: true,
      marketId: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      password: true,
    },
  });
}

export async function updateAgentById(
  agentId: string,
  data: Partial<Agent>
): Promise<Agent> {
  return prisma.agent.update({
    where: { agentId },
    data,
    select: {
      agentId: true,
      pictureUrl: true,
      marketId: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      password: true,
    },
  });
}

export async function deleteAgentById(agentId: string): Promise<void> {
  await prisma.agent.delete({
    where: { agentId },
  });
}

export async function selectAgentOrders(agentId: string) {
  return prisma.order.findMany({
    where: { agentId },
    include: {
      orderProducts: {
        include: {
          products: true
        }
      },
      users: true
    }
  });
}
