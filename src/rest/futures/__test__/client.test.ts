import { describe, it, beforeAll, expect } from "vitest";
import { FuturesRestClient } from "../client";

import { FuturesCheckServerTimeSchema, FuturesTestConnectivitySchema } from "./schema";

let client: FuturesRestClient;

beforeAll(async () => {
	client = new FuturesRestClient({ apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET });
	await client.testConnectivity();
});

describe("Binance Futures Public REST API", () => {
	describe("/fapi/v1/ping - Test Connectivity", () => {
		it("should connect to the server", async () => {
			const response = await client.testConnectivity();
			expect(response).toEqual(expect.schemaMatching(FuturesTestConnectivitySchema));
		});
	});

	describe("/fapi/v1/time - Check Server Time", () => {
		it("should return server time", async () => {
			const response = await client.checkServerTime();
			expect(response).toEqual(expect.schemaMatching(FuturesCheckServerTimeSchema));
		});
	});
});
