import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

const API_PREFIXES = [
	"auth",
	"markets",
	"products",
	"orders",
	"users",
	"sellers",
	"agents",
	"shippers",
	"giftcards",
	"promocodes",
	"images",
	"uploads",
	"docs",
	"swagger",
] as const;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const proxyTarget = env.VITE_API_URL || "http://localhost:3000";

	const proxy = Object.fromEntries(
		API_PREFIXES.map((prefix) => [
			`/${prefix}`,
			{
				target: proxyTarget,
				changeOrigin: true,
				secure: true,
				configure: (proxyServer: {
					on: (
						event: string,
						fn: (proxyReq: { setHeader: (k: string, v: string) => void }) => void
					) => void;
				}) => {
					proxyServer.on("proxyReq", (proxyReq) => {
						if (proxyTarget.includes("ngrok")) {
							proxyReq.setHeader("ngrok-skip-browser-warning", "true");
						}
					});
				},
			},
		])
	);

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			proxy,
		},
	};
});
