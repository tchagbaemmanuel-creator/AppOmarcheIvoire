/**
 * Crée/répare les comptes de test agent et livreur (la base importée de prod ne les contient pas).
 * Usage : DATABASE_URL="postgresql://..." bun run scripts/create-test-accounts.ts
 */
import prisma from "../prisma";

async function main() {
	const market = await prisma.market.findFirst();
	if (!market) throw new Error("Aucun marché en base, impossible de rattacher les comptes.");

	const agentPassword = Bun.password.hashSync("testagent");
	const existingAgent = await prisma.agent.findFirst({ where: { phone: "00000002" } });
	if (existingAgent) {
		await prisma.agent.update({
			where: { agentId: existingAgent.agentId },
			data: { password: agentPassword },
		});
		console.log("Agent 00000002 : mot de passe réinitialisé (testagent)");
	} else {
		await prisma.agent.create({
			data: {
				email: "agent@test.omarche.com",
				password: agentPassword,
				firstName: "Agent",
				lastName: "Test",
				phone: "00000002",
				marketId: market.marketId,
			},
		});
		console.log(`Agent 00000002 créé (marché ${market.name})`);
	}

	const shipperPassword = Bun.password.hashSync("testshipper");
	const existingShipper = await prisma.shipper.findFirst({ where: { phone: "00000003" } });
	if (existingShipper) {
		await prisma.shipper.update({
			where: { shipperId: existingShipper.shipperId },
			data: { password: shipperPassword },
		});
		console.log("Livreur 00000003 : mot de passe réinitialisé (testshipper)");
	} else {
		await prisma.shipper.create({
			data: {
				email: "shipper@test.omarche.com",
				password: shipperPassword,
				firstName: "Livreur",
				lastName: "Test",
				phone: "00000003",
				marketId: market.marketId,
			},
		});
		console.log(`Livreur 00000003 créé (marché ${market.name})`);
	}
}

await main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
