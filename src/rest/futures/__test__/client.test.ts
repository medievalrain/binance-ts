import { describe, it, expect, beforeAll } from "vitest";
import { FuturesRestClient } from "../client";

let client: FuturesRestClient;

beforeAll(async () => {
	client = new FuturesRestClient({ apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET });
	await client.testConnectivity();
});

describe("Binance Futures Public REST API", () => {
	describe("/fapi/v1/ping - Test Connectivity", () => {
		it("should connect to the server", async () => {
			const res = await client.testConnectivity();
			expect(res).toEqual({});
		});
	});

	describe("/fapi/v1/time - Check Server Time", () => {
		it("should return server time", async () => {
			const { serverTime } = await client.checkServerTime();
			expect(typeof serverTime).toBe("number");
			expect(serverTime).toBeGreaterThan(1_000_000_000_000);
		});
	});
});
