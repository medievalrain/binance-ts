import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	test: {
		setupFiles: ["dotenv/config"],
		typecheck: {
			enabled: true,
			include: ["src/**/*.test.ts"],
		},
	},
});
