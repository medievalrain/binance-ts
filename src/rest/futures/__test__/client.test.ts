import { describe, it, beforeAll, expectTypeOf } from "vitest";
import { FuturesRestClient } from "../client";
import type { FuturesCheckServerTime, FuturesTestConnectivity } from "../types";

let client: FuturesRestClient;

beforeAll(async () => {
	client = new FuturesRestClient({ apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET });
	await client.testConnectivity();
});

describe("Binance Futures Public REST API", () => {
	describe("/fapi/v1/ping - Test Connectivity", () => {
		it("should connect to the server", async () => {
			const response = await client.testConnectivity();
			expectTypeOf(response).toEqualTypeOf<FuturesTestConnectivity>();
		});
	});

	describe("/fapi/v1/time - Check Server Time", () => {
		it("should return server time", async () => {
			const response = await client.checkServerTime();
			expectTypeOf(response).toEqualTypeOf<FuturesCheckServerTime>();
		});
	});
});
