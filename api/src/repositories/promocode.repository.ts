import prisma from "@prisma/index";
import { PromoCode } from "@prisma/client";

export async function selectAllPromoCodes(): Promise<PromoCode[]> {
  return prisma.promoCode.findMany();
}

export async function selectPromoCodeById(
  promoCodeId: string
): Promise<PromoCode | null> {
  return prisma.promoCode.findUnique({
    where: { promoCodeId },
  });
}

export async function insertPromoCode(
  data: Omit<PromoCode, "promoCodeId" | "createdAt" | "updatedAt">
): Promise<PromoCode> {
  return prisma.promoCode.create({
    data,
  });
}

export async function updatePromoCodeById(
  promoCodeId: string,
  data: Partial<PromoCode>
): Promise<PromoCode> {
  return prisma.promoCode.update({
    where: { promoCodeId },
    data,
  });
}

export async function deletePromoCodeById(
  promoCodeId: string
): Promise<PromoCode> {
  return prisma.promoCode.delete({
    where: { promoCodeId },
  });
}

export async function selectPromoCodeByCode(
  code: string
): Promise<PromoCode | null> {
  return prisma.promoCode.findUnique({
    where: { code },
  });
}

export async function checkIfPromoCodeUsedByUserId(
  promoCodeId: string,
  userId: string
): Promise<boolean> {
  const foundPromoCode = await prisma.promoCode.findFirst({
    where: {
      promoCodeId,
    },
    include: {
      orders: {
        where: {
          userId,
        },
      },
    },
	 
  });
  const orders = foundPromoCode?.orders ?? [];
  return orders.length > 0;
}
