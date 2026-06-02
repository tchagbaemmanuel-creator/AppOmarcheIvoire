import { area_code } from "@prisma/client";
import prisma from ".";

async function seedDb() {
	try {
		await seedMarkets();
		await seedSellers();
		await seedProducts();
		await seedAgents();
		await seedUsers();
		await seedShippers();
		await seedAdmin();
		await seedGiftCards();
		console.log("🌱 Database seeding completed successfully");
	} catch (error) {
		console.log("🌱 Database seeding failed");
		console.log(error);
	}
}

async function seedAdmin()  {
	const areas : area_code[] = ['ABOBO', 'ADJAME', 'ATTECOUBE', 'COCODY', 'KOUMASSI', 'MARCORY', 'PLATEAU', 'TREICHVILLE', 'YOPOUGON', 'BROFODOUME', 'BINGERVILLE', 'PORT_BOUET', 'ANYAMA', 'SONGON'];

	await prisma.admin.createMany({
		skipDuplicates: true,
		data: [
			{
				email: "admin@omarche.com",
				password: Bun.password.hashSync("OMarche@2024"),
			},
		],
	})

	for (const area of areas) {
		await prisma.admin.create({
			data: {
				email: `admin@${area.toLowerCase()}.com`,
				password: Bun.password.hashSync(`OMarche@${area}2024`),
				areaCode: area,
			},
		});
	}
	console.log("✅ Admin seeded successfully");
}

async function seedMarkets() {
	await prisma.market.createMany({
		skipDuplicates: true,
		data: [
			{
				name: "Anono",
				areaCode: "COCODY",
				latitude: 5.3424059,
				longitude: -3.9751328,
				pictureUrl:
					"https://media-files.abidjan.net/photo/Consommateurs_Willy14.jpg",
			},
			{
				name: "Palmeraie",
				areaCode: "COCODY",
				latitude: 5.3640433,
				longitude: -3.9699977,
				pictureUrl:
					"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/e2/fc/8c/marche-de-treichville.jpg?w=1200&h=-1&s=1",
			},
			{
				name: "Cocovico",
				areaCode: "COCODY",
				latitude: 5.3829015,
				longitude: -3.9943317,
				pictureUrl:
					"https://lh5.googleusercontent.com/p/AF1QipNfxi6yNTQMWk8mk2reJtIOR5tlAmW53mMMgoMv=w408-h306-k-no",
			},
		],
	});
	console.log("✅ Markets seeded successfully");
}

async function seedSellers() {
	const market = await prisma.market.findFirst({
		where: {
			name: "Anono",
		},
	});

	if (!market) {
		throw new Error("❌ No market found");
	}

	await prisma.seller.createMany({
		skipDuplicates: true,
		data: [
			{
				firstName: "Jonathan",
				lastName: "KOUAKOU",
				gender: "M",
				tableNumber: 1,
				marketId: market.marketId,
			},
			{
				firstName: "Aminata",
				lastName: "DIALLO",
				gender: "F",
				tableNumber: 2,
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Sellers seeded successfully");
}

async function seedProducts() {
	const seller = await prisma.seller.findFirst({
		where: {
			firstName: "Jonathan",
		},
	});

	if (!seller) {
		throw new Error("❌ No seller found");
	}

	await prisma.product.createMany({
		skipDuplicates: true,
		data: [
			{
				name: "Tomates",
				amount: 1,
				unit: "KG",
				price: 500,
				description: "Notre sélection de tomates fraîches",
				pictureUrl: [
					"https://www.vincenzosonline.com/userContent/images/Blog/Tomatoes/tomatoes-5.jpg",
				],
				sellerId: seller.sellerId,
			},
			{
				name: "Pommes",
				amount: 1,
				unit: "KG",
				price: 1000,
				description: "Notre sélection de pommes fraîches",
				pictureUrl: [
					"https://hips.hearstapps.com/hmg-prod/images/apples-royalty-free-image-164084111-1537885595.jpg?crop=0.66667xw:1xh;center,top&resize=1200:*",
				],
				sellerId: seller.sellerId,
			},
		],
	});
	console.log("✅ Products seeded successfully");
}

async function seedAgents() {
	const market = await prisma.market.findFirst({
		where: { name: "Anono" },
	});

	if (!market) {
		throw new Error("❌ Anono market not found");
	}

	await prisma.agent.createMany({
		skipDuplicates: true,
		data: [
			{
				email: "agent@anono.com",
				password: Bun.password.hashSync("testagent"),
				firstName: "Franck",
				lastName: "DIAKITE",
				phone: "00000002",
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Agents seeded successfully");
}

async function seedUsers() {
	await prisma.user.createMany({
		skipDuplicates: true,
		data: [
			{
				email: "user@omarche.com",
				password: Bun.password.hashSync("testuser"), // Ensure you hash the password appropriately
				firstName: "User",
				lastName: "Anono",
				city: "Abidjan",
				address: "123 Market Street",
				phone: "00000001",
			},
		],
	});
	console.log("✅ Users seeded successfully");
}

async function seedShippers() {
	const market = await prisma.market.findFirst({
		where: { name: "Anono" },
	});

	if (!market) {
		throw new Error("❌ Anono market not found");
	}

	await prisma.shipper.createMany({
		skipDuplicates: true,
		data: [
			{
				firstName: "Hassan",
				lastName: "COULIBALY",
				email: "shipper@anono.com",
				password: Bun.password.hashSync("testshipper"),
				phone: "00000003",
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Shippers seeded successfully");
}

async function seedGiftCards() {
	const giftCardCodes = ['g0fLSsiZ22xbdtcGhPo5DMHa', 'AHPo0eQxjo6BQBoylmww2RTo', 'EoJilbA1LQKfAlFSzVDLjnSr', 'YG5k6zX3xOhL1GmLOniqRJDa', 'hyGePKNWXM5rn1XobgBnmRxI', 'yKE49ZSMIRC6CZJ22JEMdk4X', 'LjGP4TQAxc1aRFEaWauoGUVk', 'nWMCC0FAevWoDbVbGWG1Qqmq', 'SWaO8XFnNzGuOwSmuS77lFdV', 's9QL9e8UaBGBA1P4w2mk4Gaj', 'bNrdR0YG8UONbSUe41Zr28Gz', 'q9cEnd0x3JtOF1LznIxg9dEn', 'bEpwMSrnKZNGcOR8u0TGOpQx', 'v2kGzRRVqPzRexEWo6IN9twQ', 'tdbu6u5t7aqN9P6lXB3gjo1W', 'n2ZqaCmkpudvyBiRWPYluxO7', 'dlha9E70ETvjj1dKyA4VOUto', 'yT2uto0QjVnl3qXtUV5Dtn18', 'Yxdn1YRVXJIZZ9IHmQCNaDYC', 'zUEqSMZhSpZACz1HfttCiKbm', 'TrukT3WWVqMM5a6yDe79T2K0', 'kP5qfKHbNROCJMecWzE1Uqve', 'ZpcIsofSTMUZwbNvNIJKoqsh', '24ufnp3ZWTr5tfzMPStSLaUC', 'VtX4h113bZb9tDaVTv1Qvd1d', 'QhW6GH7zXYYORA27KSDc3q6n', 'Mwo0PLVWA8z2WD8ft5N1TeI1', 'y273LwaVQfmCky2Tr4OtJQA5', 'ooE9iHIrN9ufMKT9j7dQ94UA', 'rD9locTyDEBqW0UwYGBDN4lc', 'CUIHQKvQ47sy2ze04oIAp4Z3', 'jLJph3FJwo95iosJEBXJVHlM', 'bGkyFI2urc3hi504wAFu8H9t', 'zYOf2Av6g0VbaR5KryT7ocQh', 'dvrOwvFtFjVsOT0nCNOyl1F2', 'LWoWuE9mKbRpFU3LQXOnpsV8', 'C0MFHph2iasM2mUTCm8u0ozk', 'TuBmpy1TgM4C2GdD4k78L0N0', 'mzGgIzMIhn77n1nIefMC8SXE', 'S75Ag9apVJXsIiHC9YhFEhmG', 'bIHQYTBKlYxorlYl66m3OWWJ', 'eZDjXwXHQEooP0PD4A5g2KFv', 'c1cq7Aj2CAWToen2v3nWZuwA', 'eK9jWbesAJH1fmXaqSrnHRe4', 'IfovMxmrcUmjHwP2Nteq5QQJ', 'kJMJj4UhbDM79YRWj1CjkOcL', '7iBP0RbdEX0mmgugDv6GZsgp', 'MpYiSbMw2EBJiKgYmgSj9XEH', 'nDxqMwU2gYPfawg63d75ctwq', 'yZJUvXJLoX4a15TT5jTnIrcD', 'qG0mwBAm4TzZyBzkSBPKVpoa', 'bJRQh8k8uJcUbqCdUPdIz5qT', 'quaNmGCeo6RMe0xXzympBNpB', 'avq7I4kwS1uHils3LyApDuiA', '35L6S5HUuBRsnesAy1LPcpMd', 'F8snS6GKVrqZUtN6ujzl7stG', 'HFchkDLXLUnLXmvvv1RvZVud', 'SoRgOwobE7iMCSNj6O3l0eJJ', 'GgCzBF4xMPzDhuz5fKUdPn93', 'nwkieHZPG9CY8TaN3XmLqtuf', 'ZhjN1YI7S3RqlYca4WymnuVy', 'XwN1yOk8ESD2QxXZO0qxuxRI', 'i0rzOuLLwVw2PdKMEBRLcmmc', 'Z4t5OcxksluuY5FY4whTuqNv', '9jVx3X9XYcq738FjDYbrtIv3', '7NyXSAWXwsOiVdXVSUvvHRKB', 'n2V98j7KGrHRU8FkuysettFi', 'aSdAFk5yPOjOsBK3CA8qGHKu', 'ULQOBilYn1qRHa5CzacXttiX', 'x073Ars5NhqREXYghNTvVBlB', 'q6DgAGVrBHW0TgG7V1GtZCty', 'vwgpnme0htwnael88ZDeeUVi', 'aCI7zFbTKjBs43bZTRrwK77h', 'GEjP5YKOpg0zBaXybm5eXX8K', 'nlWEwzoM4yOzRJjFmPLwHLHH', '6SEAc73BjF6nVtCjOJUmBVNF', 'q7WWmYFvpMfRSJh1DTzfQu8c', 'JI5nJsIq1Vt7QdEZHjQdw8Cm', 'k9IWidEgkBHSFr6qTVJ8VvXc', '1k6iQlB9qVzcdt7qG2a8or6S', 'u9S6KONqdRqKm4lwELaFDZj3', '6I49iPqIhtUWddKskThDECMP', '8HnbUzuhXwQb3cZkka1sexaE', '2vnQ8Sx9Ktcv3OEgh5Dedei7', 'Ez70VqUfUyytmToK8fI5nrmV', 'ZO5Ca1vojt3cBfksTsEjoR1l', 'XrVpvu10TyhhNj49IYkImxZy', 'hw3gc6FA6oTFcRyZ1IIsImGh', 'acsJOxN1YEkprPBXiC6IrF8f', 'AVhzukoCcUJhqMaMFTQ14B3X', '0HuabTKy8gcNip5tfVDt6uWW', 'vq0kbVrhFTJlGd92G7iFkmRh', 'I8zoWvl24SPCf3UOdD6yg653', 'i3AnceXuoJumL2RfOfCL84AM', '0dOYiUj6YnOMFS4jUwCIYsSd', 'OgO90JVn9effnLb1Tzh9iDQ8', 'CuK3RmTxbmaDvW4gpna1BCBI', 'fhPK944tQwg3YeVUKQAM7SSU', 'CDscxqOdWRxoygDosPe6i4ZH', 'KoeLgzHbiXVd6AuPMj1XGoE1', 'D5FN5u3in5Yo2HxgwPJT3ANP', 'aK9dvEs8z4vZlrbazxXYwabe', 'ErNVG7lF9HQJ0PBZmsZHjhmO', 'O9cmuIGunsokYsualDLlxLCZ', '7M8SByqQiQl4fOFvObGiREF2', 'h8Y8j9i2VILIMjPWXwEwtCV6', 'xDpuTUumyUarjZZAkxMmICMF', 'AeJuac5yoq4JPQLBGUE6Pwbv', '0b1jmpiLgwdz6ThwxPG1t0kF', 'XpJnMeXJwjYMuPPmRXzUPfGv', 'SBZ10JchGeiCb7xDM3d2iGYT', 'PbDBYQ4bZDJOlArBdjfcHhz5', 't5fvpK66pkyH6orRlvjo2K1F', 'IGEa0fy4sk64jY84hh6wOJtb', 'gDqoKBSCMILgK9BwM4Sgb1av', 'EBL8cae6q2UHRUQSLvNUctIH', 'AUdT6suTnLILf1D4Y0zu9I1b', 'OziWFmtPqQDOzJURhD6fLfKT', 'CGiKRODSdiHbRLSoe8ZyF2LN', '8ugKodmHn9uqt2If4nkaLJjr', 'w9dvK4AC7Rh9yh8m9ogiWLO6', '193GXubgdoA2CP3SwUqxGHt5', '22NH5VCUmF8FRx5itNLfDm2D', 'jJTT418SMvQB8jjLGjhbDTp9', '1jFfthnadjdzrergwjE30kDA', 'P2Jw6GVEe9hiYQAheWdRK6is', 'UxWeUpEZga2ROKAymTEQvcV8', 'asLJIgiT8Je6Ku9wVQqBLcq3', 'kkvNmp5ufTKNvTgn5NU2gcOI', 'T16QMMFTCEwqZH4X9suC7rop', 'iddHmHfPtTYNVm6tOHv1YDO8', '56DlKGobUxwJf26WTUyDksuS', 'MbRGyq8WEF2OsOYyY5c2Vy7Y', 'ElFst9FgbJsGfT5b4Ek49OPf', 'NUeByJ5OTWeyZsKwxovo1ekh', 'luB8KECd34OIqkNKWiyYPxOG', 'JD29heLC80voPi2e1AI7pn8w', 'bH6nLzESU0xXTgSbs8u1ZnO4', 'lKoyROkhNoR6AThVSJIf3Cw2', 'wvhwlhOwvfZI4XJA9QUb9EcL', '3rOcJd4Pyn7Wc42uXCUspfGE', 'zxVl6zAVTy0P81TNA0GETO7x', 'bM4h6qqiQm7E1Gp8EORZ2iyz', 'bWjYq06R2pjwS6ZegNqp2ZX2', 'JMkmV0oypWgkmkTkVNdaVg1H', 'EfOKEcideXwO5Vp9AelswaCr', '6vSCVhUDVxzsphWVWbdfjA2X', '4CNwOOv5hfGZkiPOTURJbY3G', 'tf2yENlxTGV4v8A7yaHntduF', 'jnuoDFqKu650tXFUf95g4XEa', 'n1DTLxkzyCynHC3QPziMfX04', 'QagngTU3DpdQRWvyrchfkWw9', 'CpT9iat0RN2urDLy0NUjoyqj', 'OF7XIcJZK5T2ZR2VhERRuueC', 'b8oBYEyjg4RqCFWuJakILeon', 'QVMuNC1lwdsWDLwV6nXV5Ghx', 'FZ5pYr4ESv1jOLKAVBNO6y34', 'HFMY8tZm5idI40C4MSJLqchQ', 'aYX9rXhFBRYlzHUXpe37UyT5', 'gOqLNqiFdgLe5roHkKG9aEC6', 'fpyFECIhT4XDM6R4XRkhPcGL', 'MtxzFDKZNz8P29q9eLglIo9o', 'QQzQWvm9r6G5hyi7fMoNjRfc', 'VUYrniNuhBo5WwTuFAEFyrWN', 'N8QGZ3TJVr6LBjG8lRWbW8mG', 'kut0685qG5XJ4gjRviZplzBD', 'hEsg4ELUjFyjKv044A4rVaGS', 'IQhp8Vjsn7rqeryFPJxt2csz', 'YzxJJyIUrbIGcy4cVYeTsiMk', 'PkIef937RFrq21qhMoZbduLC', 'WDgIeCSSNkkDCpzg7NmLpIdL', 'jyrLFB0yQBcnhFJLcltf3avS', 'r7w86fgzFX0ZWpN6Hc5WzZM6', '9G7VimrNFEQ5Ggz87dJIw9S1', 'uXxJKVSFNDKd67gfu3LULuhM', 'k8X2SUrmm46GGbOyAU2psQoL', 'RRhGNJEBBqgdy6qgQaOobAoo', 'AFsRRuXbN8QTEBvRSTebo1n7', 'IiWN51b92klk3wAsfXw9cXjq', 'LJUamFUd7POsbvpF0GdF9lH4', 'uY7gxKOM0wxAqxgr3N6St0qR', 'tmYXaO65R4hoadNv9e6IF3fR', '2MQrIUcqpXmEGlktcZYQqOdX', 'KD0I1fb7cRMnXXJ01TFxqmFS', 'YypPsk4NRjrKPh1noxeX14bC', '4n2q6DyzbnPzIofT2zJkTIpr', 'ekFLJKQXEhtn1t2W7Q5v9YfM', 'Ogo6c321qDjLPzr62uKhAn9e', 'MgInIqKp63sq3rSvWVLkatpa', 'YXyID6gpIBU8p1zGemyWZtN2', 'bJlUuBwSPdv0T10yjItWT1J2', 'YqRhongYBGTpdLTpLJ0yVYi3', 'aAM2OR6skeDZQyinCF6fY2dy', 'qKUMUksIsIIRe8kIoOiyGGML', 'o3xtbEUkzUdHb8u0USfOz6tq', 'BKCWZZNN2gw8IH0FT0Ea6qCz', 'usdTbEZHFxG0eYqHvStLjaga', '40sAAE0XapXN9BskC5cXGBFG', 'Gyx8TgMimF78QHSM4IXBl3xh', 'Zk2Zk3Av0kiFptukRkh9Ptvr', 'WUaxTpsUvI8UoTlMQ9fhzPWG', 'm2jEsh7iapxTULt31Bv3gNMX', 'OTHmKeOe5P5IVEq9PYqTxFDh', '09IV0Gl0N2pTPWULBdmw1LHi', '5hJYb2ZBEmeeHCX1qxdCtLvI', 'HpTY154I9i4xPDAC2tW25uPS', '8PYGXpytyrrSup10I90PUh1T', 'WSmxEMjF9jszZYW3VXHoDyri', 'kxXNZJoykAUojYOrxP1u8W9j', 'eAmjd4u2YRWHgZ61yYAKViwV', '3R9iDnWrMkrvMWQnzDbDmxY4', 'mPQ9m47jcgndHAzmRtg7D8vk', 'd7O9nWKZx5u0gJjumZmVbgch', 'JEXVtnvIvjzyEF7FrENI3bo3', '3xDJ0RhRTZD9jMMtC3LelEG9', 'ZAXJUMlLzxnMmoBJuV4r4ad4', '4nuI0yIstJJqwwiE1giJYwvB', 'jRkP5gQ7wwdqwPDnfLSubg8D', '2EtHIxxzCZnC9I1C2CzBYjPa', '6SSMxjADcpZzgdOvuCbTT5pS', 'zbRxdtYrsPIbwunxEdp7s8LR', 'iX5IKYPaS1FFEKkIq6ukePZr', 'vxLx003BSxfmts05KGalLPjx', 'cGjQTkHWXelhSAaW9Io3AEvq', '5fQMTmM0VsdRI6koq4h7e5Z8', 'Chd9XPp3K5LTJME2t2zObepl', 'tiVtfkSflTbJeNFSArS9hnC8', 'M87SahUxmcdVi235cha0tIli', 'q26wLd7SQmFtO1Ne12cEAtRP', 'EdhXq9QwGuGhq4P4dmsonif3', 'ITxHwq0JKA0MVdLxkiP4Eu2z', 'OuogzbpO7ccBocdU4994Fpjj', 'JYFwZQ4I6Py6isLJ41F259P5', 'm67jEtZpNyLgYzKUVi23GdIY', 'O2Ce9Ixu6u5RoC10KoHKPReX', 'SiphDFlnZ6CqMlndnkT9DPJT', 'p8VhhH3QJUDya7gpONWuCdDn', 'WTyi8cP3k3IUGXEt6CbArqsb', 'lpKs8FsTaDIY6VUcRctfmsfD', 'p0GP6nYPQztUco3RJXT3Ah9m', 'rnnbbCgmuljVHgdDbgsB494g', 'AFAqxSAu7NiBJ7HdkcKQPfaW', 'MM1HNHvWE0ajtXlHWyrV1Q19', 'FAbCJbPDogBmcPAufmo8pHBk', 'b5AbHK4TNLJSXlVm26TonDDC', 'nrWkvaZh1UPpDd47zKE8JvxY', 'WrntD9prPuy3KrMUtpMAmic8', '5mZF7OW02idpcu8cxrNoDkbX', '6P2r4302HA5YpKSCFlm9clXQ', 'qi6OPJuPgcN97HjEzuBIor90'];
	const oneMonthFromNow = new Date();
	oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 6);

	await prisma.giftCard.createMany({
		skipDuplicates: true,
		data: giftCardCodes.map(code => ({
			giftCardId: code,
			expiration: oneMonthFromNow,
			status: 'IDLE'
		}))
	});
	console.log("✅ Gift cards seeded successfully");
}

console.log("🌱 Starting database seeding");
await seedDb()
	.then(() => {})
	.catch((error) => {
		console.log(error);
		console.log("🌱 Database seeding failed");
	});
