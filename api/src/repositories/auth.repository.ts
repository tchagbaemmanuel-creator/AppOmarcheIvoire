import { Agent, Admin, Shipper, User, area_code } from "@prisma/client";
import prisma from "@prisma/index";

export async function selectUserByPhone(phone: string): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			phone,
		},
	});
}

export async function insertUser(params: {
	phone: string;
	password: string;
	firstName: string;
	lastName: string;
	address: string;
}): Promise<User> {
	return await prisma.user.create({
		data: {
			phone: params.phone,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			address: params.address,
		},
	});
}

export async function selectAgentByPhone(phone: string): Promise<Agent | null> {
	return await prisma.agent.findFirst({
		where: {
			phone,
		},
	});
}

export async function insertAgent(params: {
	phone: string;
	password: string;
	firstName: string;
	lastName: string;
	marketId: string;
}): Promise<Agent> {
	return await prisma.agent.create({
		data: {
			phone: params.phone,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		},
	});
}

export async function selectAdminByEmail(email: string): Promise<Admin | null> {
	return await prisma.admin.findFirst({
		where: {
			email,
		},
	});
}

export async function insertAdmin(params: {
	email: string;
	password: string;
	areaCode?: area_code | null;
}): Promise<Admin> {
	// Upsert pour permettre de transformer un admin "zoné" en admin général
	// (areaCode => null) sans créer un nouvel email.
	return await prisma.admin.upsert({
		where: { email: params.email },
		update: {
			password: params.password,
			areaCode: params.areaCode ?? null,
		},
		create: {
			email: params.email,
			password: params.password,
			areaCode: params.areaCode ?? null,
		},
	});
}

export async function selectShipperByPhone(phone: string): Promise<Shipper | null> {
	return await prisma.shipper.findFirst({
		where: {
			phone,
		},
	});
}

export async function insertShipper(params: {
	phone: string;
	password: string;
	firstName: string;
	lastName: string;
	marketId: string;
}): Promise<Shipper> {
	return await prisma.shipper.create({
		data: {
			phone: params.phone,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		},
	});
}
