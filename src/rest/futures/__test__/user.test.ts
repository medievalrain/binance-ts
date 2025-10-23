import { describe, it, beforeAll, expect } from "vitest";
import { FuturesRestClient } from "../client";

import {
	futuresAccountBalanceSchema,
	futuresAccountInfoSchema,
	futuresCommissionRateSchema,
	futuresAccountConfigSchema,
	futuresSymbolConfigSchema,
	futuresUserRateLimitSchema,
	futuresLeverageBracketSchema,
	futuresPositionModeSchema,
	futuresIncomeHistorySchema,
	futuresGetListenKeySchema,
} from "./schema.gen";

let client: FuturesRestClient;

const SYMBOL = "BTCUSDT";

beforeAll(async () => {
	client = new FuturesRestClient({
		apiKey: process.env.API_KEY,
		apiSecret: process.env.API_SECRET,
	});
	await client.testConnectivity();
});

describe("Binance Futures REST API - Private Endpoints", () => {
	describe("/fapi/v3/balance - Account Balance", () => {
		it("matches schema", async () => {
			const res = await client.accountBalance();
			expect(res).toEqual(expect.schemaMatching(futuresAccountBalanceSchema.strict().array()));
		});
	});

	describe("/fapi/v3/account - Account Information", () => {
		it("matches schema", async () => {
			const res = await client.accountInformation();
			expect(res).toEqual(expect.schemaMatching(futuresAccountInfoSchema.strict()));
		});
	});

	describe("/fapi/v1/commissionRate - User Commission Rate", () => {
		it("matches schema", async () => {
			const res = await client.userCommissionRate({ symbol: SYMBOL });
			expect(res).toEqual(expect.schemaMatching(futuresCommissionRateSchema.strict()));
		});
	});

	describe("/fapi/v1/accountConfig - Account Config", () => {
		it("matches schema", async () => {
			const res = await client.accountConfig();
			expect(res).toEqual(expect.schemaMatching(futuresAccountConfigSchema.strict()));
		});
	});

	describe("/fapi/v1/symbolConfig - Symbol Config", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.symbolConfig({ symbol: SYMBOL });
			expect(res).toEqual(expect.schemaMatching(futuresSymbolConfigSchema.strict().array()));
		});
	});

	describe("/fapi/v1/rateLimit/order - User Rate Limit", () => {
		it("matches schema", async () => {
			const res = await client.userRateLimit();
			expect(res).toEqual(expect.schemaMatching(futuresUserRateLimitSchema.strict().array()));
		});
	});

	describe("/fapi/v1/leverageBracket - Leverage Brackets", () => {
		it("by symbol: matches array schema", async () => {
			const res = await client.leverageBrackets({ symbol: SYMBOL });
			expect(res).toEqual(expect.schemaMatching(futuresLeverageBracketSchema.strict().array()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.leverageBrackets();
			expect(res).toEqual(expect.schemaMatching(futuresLeverageBracketSchema.strict().array()));
		});
	});

	describe("/fapi/v1/positionSide/dual - Position Mode", () => {
		it("matches schema", async () => {
			const res = await client.positionMode();
			expect(res).toEqual(expect.schemaMatching(futuresPositionModeSchema.strict()));
		});
	});

	describe("/fapi/v1/income - Income History", () => {
		it("matches schema", async () => {
			const res = await client.incomeHistory({ limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresIncomeHistorySchema.strict().array()));
		});
	});

	describe("/fapi/v1/listenKey - Get Listen Key", () => {
		it("matches schema", async () => {
			const res = await client.getListenKey();
			expect(res).toEqual(expect.schemaMatching(futuresGetListenKeySchema.strict()));
		});
	});
});
