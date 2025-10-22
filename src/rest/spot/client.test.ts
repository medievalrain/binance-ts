import { describe, it, beforeAll, expectTypeOf } from "vitest";
import { SpotRestClient } from "./client";
import type { SpotCheckServerTime, SpotTestConnectivity } from "./types";

let client: SpotRestClient;

beforeAll(async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;

	client = new SpotRestClient({ apiKey, apiSecret });
	await client.testConnectivity();
});

describe("Binance Spot Public REST API", () => {
	describe("/api/v3/ping - Test Connectivity", () => {
		it("should connect to the server", async () => {
			const response = await client.testConnectivity();
			expectTypeOf(response).toEqualTypeOf<SpotTestConnectivity>();
		});
	});

	describe("/api/v3/time - Check Server Time", () => {
		it("should return server time", async () => {
			const response = await client.checkServerTime();
			expectTypeOf(response).toEqualTypeOf<SpotCheckServerTime>();
		});
	});
});
