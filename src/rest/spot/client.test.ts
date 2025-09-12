import { describe, it, expect, beforeAll } from "vitest";
import { SpotRestClient } from "./client";

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
			const res = await client.testConnectivity();
			expect(res).toEqual({});
		});
	});

	describe("/api/v3/time - Check Server Time", () => {
		it("should return server time", async () => {
			const { serverTime } = await client.checkServerTime();
			expect(serverTime).toBeGreaterThan(1_000_000_000_000);
		});
	});
});
