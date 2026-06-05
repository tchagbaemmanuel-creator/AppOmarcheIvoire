export type SectionVisual = {
	key: string;
	title: string;
	subtitle: string;
	image: string;
	imageAlt: string;
};

const visuals = {
	markets: {
		key: "markets",
		title: "Marchés & épiceries",
		subtitle: "Gérez les marchés partenaires, vendeurs et produits par zone.",
		image:
			"https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80",
		imageAlt: "Marché de produits vivriers",
	},
	orders: {
		key: "orders",
		title: "Commandes",
		subtitle: "Suivez et traitez les commandes clients en temps réel.",
		image:
			"https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
		imageAlt: "Préparation de commandes au marché",
	},
	cards: {
		key: "cards",
		title: "Cartes cadeaux",
		subtitle: "Créez et assignez les cartes cadeaux aux utilisateurs.",
		image:
			"https://images.unsplash.com/photo-1513885535758-7b57fbd381c6?w=1200&q=80",
		imageAlt: "Cartes cadeaux",
	},
	promoCodes: {
		key: "promoCodes",
		title: "Codes promotionnels",
		subtitle: "Paramétrez les réductions et campagnes promo.",
		image:
			"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
		imageAlt: "Codes promo",
	},
	agents: {
		key: "agents",
		title: "Agents & vendeurs",
		subtitle: "Comptes agents rattachés aux marchés et gestion des ventes.",
		image:
			"https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=1200&q=80",
		imageAlt: "Commerçants au marché",
	},
	shippers: {
		key: "shippers",
		title: "Livreurs",
		subtitle: "Gérez les livreurs et leurs affectations par marché.",
		image:
			"https://images.unsplash.com/photo-1578575437130-527eed3eabed?w=1200&q=80",
		imageAlt: "Livreur à moto avec sac de livraison",
	},
	users: {
		key: "users",
		title: "Utilisateurs",
		subtitle: "Clients inscrits, historique et informations de compte.",
		image:
			"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
		imageAlt: "Utilisateurs de l'application",
	},
	default: {
		key: "default",
		title: "Tableau de bord SGI",
		subtitle: "Système de gestion interne O'Marché Ivoire.",
		image:
			"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
		imageAlt: "Marché local",
	},
} as const satisfies Record<string, SectionVisual>;

export function getSectionVisual(pathname: string): SectionVisual {
	if (pathname.startsWith("/orders")) return visuals.orders;
	if (pathname.startsWith("/markets") || pathname.startsWith("/sellers"))
		return visuals.markets;
	if (pathname.startsWith("/cards")) return visuals.cards;
	if (pathname.startsWith("/promo-codes")) return visuals.promoCodes;
	if (pathname.startsWith("/agents")) return visuals.agents;
	if (pathname.startsWith("/shippers")) return visuals.shippers;
	if (pathname.startsWith("/users")) return visuals.users;
	if (pathname === "/" || pathname === "") return visuals.markets;
	return visuals.default;
}
