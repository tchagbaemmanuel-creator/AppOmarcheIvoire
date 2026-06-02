import prisma from "@prisma/index";
import { User } from "@prisma/client";

export async function selectAllUsers(): Promise<User[]> {
	return prisma.user.findMany();
}

export async function insertUser(data: {
	email?: string | null;
	password: string;
	firstName: string;
	lastName: string;
	city?: string | null;
	address: string;
	phone: string;
}): Promise<User> {
	return prisma.user.create({
		data: {
			email: data.email ?? null,
			password: data.password,
			firstName: data.firstName,
			lastName: data.lastName,
			city: data.city ?? undefined,
			address: data.address,
			phone: data.phone,
		},
	});
}

export async function selectUserById(userId: string): Promise<User | null> {
	return prisma.user.findUnique({
		where: { userId },
	});
}

export async function updateUserById(
	userId: string,
	data: Partial<User>
): Promise<User> {
	return prisma.user.update({
		where: { userId },
		data,
	});
}

export async function deleteUserById(userId: string): Promise<void> {
	await prisma.user.delete({
		where: { userId },
	});
}
