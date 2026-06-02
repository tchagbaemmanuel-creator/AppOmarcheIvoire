import prisma from "../prisma/index";

const email = process.argv[2] ?? "admin@omarche.com";
const password = process.argv[3] ?? "OMarche@2024";

const admin = await prisma.admin.findFirst({ where: { email } });
if (!admin) {
	console.error(`Admin introuvable : ${email}`);
	process.exit(1);
}

await prisma.admin.update({
	where: { adminId: admin.adminId },
	data: { password: Bun.password.hashSync(password) },
});

console.log(`Mot de passe mis à jour pour ${email}`);
await prisma.$disconnect();
