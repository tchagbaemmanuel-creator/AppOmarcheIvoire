/** Spécification OpenAPI manuelle (les handlers n'utilisent pas encore createRoute). */
export const openApiDocument = {
	openapi: "3.0.0",
	info: {
		title: "O'Marché Ivoire API",
		version: "1.0.0",
		description:
			"API REST Omarche. La plupart des routes (hors /auth) nécessitent un JWT Bearer.",
	},
	servers: [{ url: "/", description: "Serveur courant (local ou ngrok)" }],
	tags: [
		{ name: "Auth", description: "Connexion et inscription" },
		{ name: "Markets", description: "Marchés" },
		{ name: "Orders", description: "Commandes" },
		{ name: "Users", description: "Clients" },
		{ name: "Agents", description: "Vendeurs / agents" },
		{ name: "Shippers", description: "Livreurs" },
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			AdminLogin: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", example: "admin@omarche.com" },
					password: { type: "string", example: "OMarche@2024" },
				},
			},
			Error: {
				type: "object",
				properties: {
					status: { type: "string", example: "error" },
					message: { type: "string" },
					code: { type: "integer" },
				},
			},
		},
	},
	paths: {
		"/auth/admin/login": {
			post: {
				tags: ["Auth"],
				summary: "Connexion admin (SGI)",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/AdminLogin" },
						},
					},
				},
				responses: {
					"200": { description: "Token JWT + profil admin" },
					"401": {
						description: "E-mail/mot de passe incorrect",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/auth/user/login": {
			post: {
				tags: ["Auth"],
				summary: "Connexion client (téléphone + mot de passe)",
				responses: { "200": { description: "Token JWT" } },
			},
		},
		"/auth/agent/login": {
			post: {
				tags: ["Auth"],
				summary: "Connexion agent vendeur",
				responses: { "200": { description: "Token JWT" } },
			},
		},
		"/auth/shipper/login": {
			post: {
				tags: ["Auth"],
				summary: "Connexion livreur",
				responses: { "200": { description: "Token JWT" } },
			},
		},
		"/markets/": {
			get: {
				tags: ["Markets"],
				summary: "Liste des marchés",
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: "a",
						in: "query",
						description: "Filtre par zone (area_code)",
						schema: { type: "string" },
					},
				],
				responses: { "200": { description: "Liste des marchés" } },
			},
			post: {
				tags: ["Markets"],
				summary: "Créer un marché",
				security: [{ bearerAuth: [] }],
				responses: { "201": { description: "Marché créé" } },
			},
		},
		"/markets/{marketId}": {
			get: {
				tags: ["Markets"],
				summary: "Détail d'un marché",
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: "marketId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
				],
				responses: { "200": { description: "Marché" } },
			},
		},
		"/orders/": {
			get: {
				tags: ["Orders"],
				summary: "Liste des commandes",
				security: [{ bearerAuth: [] }],
				responses: { "200": { description: "Commandes" } },
			},
			post: {
				tags: ["Orders"],
				summary: "Créer une commande",
				security: [{ bearerAuth: [] }],
				responses: { "201": { description: "Commande créée" } },
			},
		},
		"/orders/{id}": {
			get: {
				tags: ["Orders"],
				summary: "Détail commande",
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
				],
				responses: { "200": { description: "Commande" } },
			},
		},
		"/users/": {
			get: {
				tags: ["Users"],
				summary: "Liste des utilisateurs",
				security: [{ bearerAuth: [] }],
				responses: { "200": { description: "Utilisateurs" } },
			},
		},
		"/agents/": {
			get: {
				tags: ["Agents"],
				summary: "Liste des agents",
				security: [{ bearerAuth: [] }],
				responses: { "200": { description: "Agents" } },
			},
		},
		"/shippers/": {
			get: {
				tags: ["Shippers"],
				summary: "Liste des livreurs",
				security: [{ bearerAuth: [] }],
				responses: { "200": { description: "Livreurs" } },
			},
		},
	},
} as const;
