import prisma from "@prisma/index";
import { Shipper } from "@prisma/client";

export async function selectAllShippers(): Promise<Shipper[]> {
    return prisma.shipper.findMany();
}

export async function selectShipperById(
    shipperId: string
): Promise<Shipper | null> {
    return prisma.shipper.findUnique({
        where: { shipperId },
    });
}

export async function updateShipperById(
    shipperId: string,
    data: Partial<Shipper>
): Promise<Shipper> {
    return prisma.shipper.update({
        where: { shipperId },
        data,
    });
}

export async function deleteShipperById(shipperId: string): Promise<void> {
    await prisma.shipper.delete({
        where: { shipperId },
    });
}

export async function createShipper(data: Omit<Shipper, "shipperId" | "createdAt" | "updatedAt">): Promise<Shipper> {
    return prisma.shipper.create({
        data,
    });
}
