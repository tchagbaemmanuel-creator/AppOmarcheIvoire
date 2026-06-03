const remoteApiUrl = import.meta.env.VITE_API_URL as string | undefined;

/** En dev avec ngrok : requêtes via le proxy Vite (évite CORS + page d’avertissement ngrok). */
const useDevProxy =
	import.meta.env.DEV &&
	import.meta.env.VITE_USE_PROXY !== "false" &&
	(!remoteApiUrl || remoteApiUrl.includes("ngrok"));

/** Base URL de l'API (Vite : variables préfixées VITE_). */
export const API_URL = useDevProxy
	? ""
	: remoteApiUrl ??
		(import.meta.env.DEV
			? "http://localhost:3000"
			: "https://appomarcheivoire.onrender.com");
