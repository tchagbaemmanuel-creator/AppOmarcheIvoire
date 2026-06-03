/**
 * Importe les données de database.sql (dump production) vers la base cible (Neon).
 * Usage : DATABASE_URL="postgresql://..." bun run scripts/import-production-dump.ts
 */
import { readFileSync } from "fs";
import { join } from "path";
import prisma from "../prisma/index";

const DUMP_PATH = join(import.meta.dir, "../../database.sql");

const IMPORT_ORDER = [
	"Market",
	"Admin",
	"User",
	"Seller",
	"Product",
	"Agent",
	"Shipper",
	"PromoCode",
	"GiftCard",
	"Order",
	"OrderProducts",
] as const;

type TableName = (typeof IMPORT_ORDER)[number];

function extractCopyBlocks(sql: string): Map<TableName, { columns: string[]; rows: string[][] }> {
	const blocks = new Map<TableName, { columns: string[]; rows: string[][] }>();
	const re = /COPY public\.\"(\w+)\" \(([^)]+)\) FROM stdin;\n([\s\S]*?)\n\\\./g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(sql)) !== null) {
		const table = m[1] as TableName;
		if (!IMPORT_ORDER.includes(table)) continue;
		const columns = m[2].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
		const rows = m[3]
			.split("\n")
			.filter((line) => line.length > 0)
			.map((line) => parseCopyRow(line, columns.length));
		blocks.set(table, { columns, rows });
	}
	return blocks;
}

function parseCopyRow(line: string, colCount: number): string[] {
	const parts = line.split("\t");
	if (parts.length === colCount) return parts;
	if (parts.length > colCount) {
		return [
			...parts.slice(0, colCount - 1),
			parts.slice(colCount - 1).join("\t"),
		];
	}
	while (parts.length < colCount) parts.push("");
	return parts;
}

function toSqlLiteral(value: string, column: string): string {
	if (value === "\\N") return "NULL";
	if (column === "pictureUrl" && value.startsWith("{")) {
		const inner = value.slice(1, -1).trim();
		if (!inner) return "ARRAY[]::text[]";
		const items = inner.split(",").map((u) => `'${u.replace(/'/g, "''")}'`);
		return `ARRAY[${items.join(",")}]::text[]`;
	}
	if (value === "t") return "TRUE";
	if (value === "f") return "FALSE";
	return `'${value.replace(/'/g, "''")}'`;
}

async function insertBatch(table: string, columns: string[], rows: string[][]) {
	const quotedCols = columns.map((c) => `"${c}"`).join(", ");
	const BATCH = 80;
	for (let i = 0; i < rows.length; i += BATCH) {
		const chunk = rows.slice(i, i + BATCH);
		const values = chunk
			.map(
				(row) =>
					`(${row.map((cell, idx) => toSqlLiteral(cell, columns[idx]!)).join(", ")})`
			)
			.join(",\n");
		await prisma.$executeRawUnsafe(
			`INSERT INTO "${table}" (${quotedCols}) VALUES ${values}`
		);
	}
}

async function main() {
	if (!process.env.DATABASE_URL) {
		console.error("❌ DATABASE_URL manquant");
		process.exit(1);
	}

	console.log("📂 Lecture de database.sql…");
	const sql = readFileSync(DUMP_PATH, "utf8");
	const blocks = extractCopyBlocks(sql);

	for (const table of IMPORT_ORDER) {
		if (!blocks.has(table)) {
			console.warn(`⚠️  Table ${table} absente du dump`);
		}
	}

	console.log("🗑️  Vidage des tables…");
	await prisma.$executeRawUnsafe(`
		TRUNCATE TABLE
			"PasswordResetRequest",
			"OrderProducts",
			"Order",
			"GiftCard",
			"PromoCode",
			"Product",
			"Seller",
			"Agent",
			"Shipper",
			"User",
			"Admin",
			"Market"
		RESTART IDENTITY CASCADE
	`);

	// Le dump prod contient plusieurs Product avec le même (name, sellerId).
	await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "uc_product"`);

	for (const table of IMPORT_ORDER) {
		const block = blocks.get(table);
		if (!block || block.rows.length === 0) {
			console.log(`⏭️  ${table} : vide`);
			continue;
		}
		console.log(`📥 ${table} : ${block.rows.length} lignes…`);
		try {
			await insertBatch(table, block.columns, block.rows);
		} catch (err) {
			console.error(`❌ Échec sur ${table}`);
			throw err;
		}
	}

	const adminHash = Bun.password.hashSync("OMarche@2024");
	await prisma.admin.updateMany({
		where: { email: "admin@omarche.com" },
		data: { password: adminHash },
	});

	const counts = {
		markets: await prisma.market.count(),
		orders: await prisma.order.count(),
		orderProducts: await prisma.orderProducts.count(),
		users: await prisma.user.count(),
		products: await prisma.product.count(),
	};

	console.log("✅ Import terminé :", counts);
}

main()
	.catch((e) => {
		console.error("❌ Import échoué", e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
