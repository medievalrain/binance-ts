import { describe, it, beforeAll, expect } from "vitest";
import { FuturesRestClient } from "../client";

import { futuresCheckServerTimeSchema, futuresExchangeInfoSchema, futuresTestConnectivitySchema } from "./schema";

let client: FuturesRestClient;

beforeAll(async () => {
	client = new FuturesRestClient({ apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET });
	await client.testConnectivity();
});

describe("Binance Futures Public REST API", () => {
	describe("/fapi/v1/ping - Test Connectivity", () => {
		it("Should match schema", async () => {
			const response = await client.testConnectivity();
			expect(response).toEqual(expect.schemaMatching(futuresTestConnectivitySchema));
		});
	});

	describe("/fapi/v1/time - Check Server Time", () => {
		it("Should match schema", async () => {
			const response = await client.checkServerTime();
			expect(response).toEqual(expect.schemaMatching(futuresCheckServerTimeSchema));
		});
	});

	describe("/fapi/v1/exchangeInfo - Exchange Information", () => {
		it("Should match schema", async () => {
			const response = await client.exchangeInformation();
			expect(response).toEqual(expect.schemaMatching(futuresExchangeInfoSchema));
		});
	});
});
