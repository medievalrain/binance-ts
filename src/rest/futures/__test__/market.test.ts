import { describe, it, beforeAll, expect } from "vitest";
import { FuturesRestClient } from "../client";

import {
	futuresTestConnectivitySchema,
	futuresCheckServerTimeSchema,
	futuresExchangeInfoSchema,
	futuresOrderBookSchema,
	futuresTradeSchema,
	futuresAggregateTradeSchema,
	futuresKlineSchema,
	futuresMarkPriceSchema,
	futuresFundingRateSchema,
	futuresFundingInfoSchema,
	futuresTicker24hSchema,
	futuresSymbolPriceSchema,
	futuresBookTickerSchema,
	futuresDeliveryPriceSchema,
	futuresOpenInterestSchema,
	futuresOpenInterestStatsSchema,
	futuresLongShortRatioSchema,
	futuresTakerBuySellRatioSchema,
	futuresBasisSchema,
	futuresCompositeIndexSchema,
	futuresAssetIndexSchema,
	futuresIndexPriceConstituentsSchema,
} from "./schema.gen";

let client: FuturesRestClient;

beforeAll(async () => {
	client = new FuturesRestClient({
		apiKey: process.env.API_KEY,
		apiSecret: process.env.API_SECRET,
	});
	await client.testConnectivity();
});

describe("Binance Futures REST API - Public Endpoints", () => {
	describe("/fapi/v1/ping - Test Connectivity", () => {
		it("matches schema", async () => {
			const res = await client.testConnectivity();
			expect(res).toEqual(expect.schemaMatching(futuresTestConnectivitySchema.strict()));
		});
	});

	describe("/fapi/v1/time - Check Server Time", () => {
		it("matches schema", async () => {
			const res = await client.checkServerTime();
			expect(res).toEqual(expect.schemaMatching(futuresCheckServerTimeSchema.strict()));
		});
	});

	describe("/fapi/v1/exchangeInfo - Exchange Information", () => {
		it("matches schema", async () => {
			const res = await client.exchangeInformation();
			expect(res).toEqual(expect.schemaMatching(futuresExchangeInfoSchema.strict()));
		});
	});

	describe("/fapi/v1/depth - Order Book", () => {
		it("matches schema", async () => {
			const res = await client.orderBook({ symbol: "BTCUSDT", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresOrderBookSchema.strict()));
		});
	});

	describe("/fapi/v1/trades - Recent Trades", () => {
		it("matches schema", async () => {
			const res = await client.recentTrades({ symbol: "BTCUSDT", limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresTradeSchema.strict().array()));
		});
	});

	describe("/fapi/v1/historicalTrades - Old Trades Lookup", () => {
		it("matches schema", async () => {
			const res = await client.oldTradesLookup({ symbol: "BTCUSDT", limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresTradeSchema.strict().array()));
		});
	});

	describe("/fapi/v1/aggTrades - Aggregate Trades", () => {
		it("matches schema", async () => {
			const res = await client.aggregateTrades({ symbol: "BTCUSDT", limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresAggregateTradeSchema.strict().array()));
		});
	});

	describe("/fapi/v1/klines - Kline/Candlestick Data", () => {
		it("matches schema", async () => {
			const res = await client.klineData({ symbol: "BTCUSDT", interval: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresKlineSchema.array()));
		});
	});

	describe("/fapi/v1/continuousKlines - Continuous Contract Klines", () => {
		it("matches schema", async () => {
			const res = await client.continuousContractKlineData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				interval: "5m",
				limit: 5,
			});
			expect(res).toEqual(expect.schemaMatching(futuresKlineSchema.array()));
		});
	});

	describe("/fapi/v1/indexPriceKlines - Index Price Klines", () => {
		it("matches schema", async () => {
			const res = await client.indexPriceKlineData({ pair: "BTCUSDT", interval: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresKlineSchema.array()));
		});
	});

	describe("/fapi/v1/markPriceKlines - Mark Price Klines", () => {
		it("matches schema", async () => {
			const res = await client.markPriceKlineData({ symbol: "BTCUSDT", interval: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresKlineSchema.array()));
		});
	});

	describe("/fapi/v1/premiumIndexKlines - Premium Index Klines", () => {
		it("matches schema", async () => {
			const res = await client.premiumIndexKlineData({ symbol: "BTCUSDT", interval: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresKlineSchema.array()));
		});
	});

	describe("/fapi/v1/premiumIndex - Mark Price", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.markPrice({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresMarkPriceSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.markPrice();
			expect(res).toEqual(expect.schemaMatching(futuresMarkPriceSchema.strict().array()));
		});
	});

	describe("/fapi/v1/fundingRate - Funding Rate History", () => {
		it("matches array schema (no symbol)", async () => {
			const res = await client.fundingRateHistory({ limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresFundingRateSchema.strict().array()));
		});

		it("matches array schema (with symbol)", async () => {
			const res = await client.fundingRateHistory({ symbol: "BTCUSDT", limit: 10 });
			expect(res).toEqual(expect.schemaMatching(futuresFundingRateSchema.strict().array()));
		});
	});

	describe("/fapi/v1/fundingInfo - Funding Info", () => {
		it("matches schema", async () => {
			const res = await client.fundingRateInfo();
			expect(res).toEqual(expect.schemaMatching(futuresFundingInfoSchema.strict().array()));
		});
	});

	describe("/fapi/v1/ticker/24hr - 24h Ticker", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.ticker24h({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresTicker24hSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.ticker24h();
			expect(res).toEqual(expect.schemaMatching(futuresTicker24hSchema.strict().array()));
		});
	});

	describe("/fapi/v2/ticker/price - Symbol Price Ticker", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.symbolPriceTicker({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresSymbolPriceSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.symbolPriceTicker();
			expect(res).toEqual(expect.schemaMatching(futuresSymbolPriceSchema.strict().array()));
		});
	});

	describe("/fapi/v1/ticker/bookTicker - Book Ticker", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.bookTicker({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresBookTickerSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.bookTicker();
			expect(res).toEqual(expect.schemaMatching(futuresBookTickerSchema.strict().array()));
		});
	});

	describe("/futures/data/delivery-price - Quarterly Settlement Prices", () => {
		it("matches schema", async () => {
			const res = await client.quarterlySettlementPrices({ pair: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresDeliveryPriceSchema.strict().array()));
		});
	});

	describe("/fapi/v1/openInterest - Open Interest", () => {
		it("matches schema", async () => {
			const res = await client.openInterest({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresOpenInterestSchema.strict()));
		});
	});

	describe("/futures/data/openInterestHist - Open Interest Stats", () => {
		it("matches schema", async () => {
			const res = await client.openInterestStats({ symbol: "BTCUSDT", period: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresOpenInterestStatsSchema.strict().array()));
		});
	});

	describe("/futures/data/topLongShortPositionRatio - Top L/S Position Ratio", () => {
		it("matches schema", async () => {
			const res = await client.topLongShortPositionRatio({ symbol: "BTCUSDT", period: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresLongShortRatioSchema.strict().array()));
		});
	});

	describe("/futures/data/topLongShortAccountRatio - Top L/S Account Ratio", () => {
		it("matches schema", async () => {
			const res = await client.topLongShortAccountRatio({ symbol: "BTCUSDT", period: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresLongShortRatioSchema.strict().array()));
		});
	});

	describe("/futures/data/globalLongShortAccountRatio - Global L/S Account Ratio", () => {
		it("matches schema", async () => {
			const res = await client.globalLongShortAccountRatio({ symbol: "BTCUSDT", period: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresLongShortRatioSchema.strict().array()));
		});
	});

	describe("/futures/data/takerlongshortRatio - Taker Buy/Sell Ratio", () => {
		it("matches schema", async () => {
			const res = await client.takerBuySellRatio({ symbol: "BTCUSDT", period: "5m", limit: 5 });
			expect(res).toEqual(expect.schemaMatching(futuresTakerBuySellRatioSchema.strict().array()));
		});
	});

	describe("/futures/data/basis - Basis Data", () => {
		it("matches schema", async () => {
			const res = await client.basisData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				period: "5m",
				limit: 5,
			});
			expect(res).toEqual(expect.schemaMatching(futuresBasisSchema.strict().array()));
		});
	});

	describe("/fapi/v1/indexInfo - Composite Index Info", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.compositeIndexInfo({ symbol: "BTCDOMUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresCompositeIndexSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.compositeIndexInfo();
			expect(res).toEqual(expect.schemaMatching(futuresCompositeIndexSchema.strict().array()));
		});
	});

	describe("/fapi/v1/assetIndex - Asset Index", () => {
		it("by symbol: matches single-object schema", async () => {
			const res = await client.assetIndex({ symbol: "BTCUSD" });
			expect(res).toEqual(expect.schemaMatching(futuresAssetIndexSchema.strict()));
		});

		it("all symbols: matches array schema", async () => {
			const res = await client.assetIndex();
			expect(res).toEqual(expect.schemaMatching(futuresAssetIndexSchema.strict().array()));
		});
	});

	describe("/fapi/v1/constituents - Index Price Constituents", () => {
		it("matches schema", async () => {
			const res = await client.indexPriceConstituents({ symbol: "BTCUSDT" });
			expect(res).toEqual(expect.schemaMatching(futuresIndexPriceConstituentsSchema.strict()));
		});
	});
});
