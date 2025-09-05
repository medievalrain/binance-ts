import { describe, it, expect, beforeAll } from "vitest";
import { FuturesRestClient } from "./client";
import { addHours, addSeconds, subDays, subHours, subMinutes } from "date-fns";
import type { FuturesContractType, FuturesKlineInterval } from "./types";
import { MalformedParamError } from "@/shared/api-error";

let client: FuturesRestClient;

beforeAll(async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;
	if (!apiKey || !apiSecret) {
		throw new Error("No credentials provided");
	}

	client = new FuturesRestClient({
		credentials: { key: apiKey, secret: apiSecret },
	});
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

	describe("/fapi/v1/exchangeInfo - Exchange Information", { timeout: 10000 }, () => {
		it("should return exchange information", async () => {
			const info = await client.exchangeInformation();
			expect(info.symbols.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v1/depth - Order Book", () => {
		it("should fetch order book for BTCUSDT", async () => {
			const book = await client.orderBook({ symbol: "BTCUSDT", limit: 5 });
			expect(book.asks.length).toBe(5);
		});
	});

	describe("/fapi/v1/trades - Recent Trades List", () => {
		it("should return recent trades for BTCUSDT", async () => {
			const trades = await client.recentTrades({ symbol: "BTCUSDT", limit: 5 });
			expect(trades.length).toBeGreaterThan(0);
			expect(trades.length).toBeLessThanOrEqual(5);
		});
	});

	describe("/fapi/v1/historicalTrades - Old Trades Lookup (MARKET_DATA)", () => {
		it("should return trades for BTCUSDT with default params", async () => {
			const trades = await client.oldTradesLookup({ symbol: "BTCUSDT" });
			expect(trades.length).toBeGreaterThan(0);
		});

		it("should respect the limit param", async () => {
			const trades = await client.oldTradesLookup({ symbol: "BTCUSDT", limit: 3 });
			expect(trades.length).toBe(3);
		});

		it("should return consistent results using fromId", async () => {
			const firstBatch = await client.oldTradesLookup({ symbol: "BTCUSDT", limit: 10 });
			const fromId = Number(firstBatch?.[0]?.id) - 20000;

			const secondBatch = await client.oldTradesLookup({
				symbol: "BTCUSDT",
				fromId,
				limit: 5,
			});

			expect(secondBatch?.[0]?.id).toBe(fromId);
		});

		it("should return empty array if fromId is too high", async () => {
			const trades = await client.oldTradesLookup({ symbol: "BTCUSDT", fromId: 0 });
			expect(trades).toEqual([]);
		});
	});

	describe("/fapi/v1/aggTrades - Compressed/Aggregate Trades List", () => {
		it("should return recent aggregate trades", async () => {
			const trades = await client.aggregateTrades({ symbol: "BTCUSDT", limit: 5 });
			expect(trades.length).toBeGreaterThan(0);
			expect(trades.length).toBeLessThanOrEqual(5);
		});

		it("should respect fromId param", async () => {
			const base = await client.aggregateTrades({ symbol: "BTCUSDT", limit: 3 });
			const fromId = base[1]?.a;

			const trades = await client.aggregateTrades({ symbol: "BTCUSDT", fromId, limit: 2 });
			expect(trades[0]?.a).toBe(fromId);
		});

		it("should respect startTime and endTime", async () => {
			const start = subMinutes(new Date(), 1);
			const end = new Date();

			const trades = await client.aggregateTrades({
				symbol: "BTCUSDT",
				startTime: start.getTime(),
				endTime: end.getTime(),
				limit: 5,
			});

			expect(trades.length).toBeGreaterThanOrEqual(0);
		});

		it("should return empty array for future time window", async () => {
			const start = addHours(new Date(), 1);
			const end = addSeconds(start, 1);

			const trades = await client.aggregateTrades({
				symbol: "BTCUSDT",
				startTime: start.getTime(),
				endTime: end.getTime(),
				limit: 5,
			});

			expect(trades).toEqual([]);
		});
	});

	describe("/fapi/v1/klines - Kline/Candlestick Data", () => {
		it("returns default 500 candles if limit is not provided", async () => {
			const data = await client.klineData({ symbol: "BTCUSDT", interval: "1h" });
			expect(data.length).toBe(500);
		});

		it("respects provided limit = 32", async () => {
			const data = await client.klineData({ symbol: "BTCUSDT", interval: "1h", limit: 32 });
			expect(data.length).toBe(32);
		});

		it("should return different results with different startTime", async () => {
			const now = new Date();
			const past = subDays(now, 1);
			const windowEnd = addHours(past, 2);

			const recent = await client.klineData({ symbol: "BTCUSDT", interval: "1h", limit: 2 });
			const historical = await client.klineData({
				symbol: "BTCUSDT",
				interval: "1h",
				limit: 2,
				startTime: past.getTime(),
				endTime: windowEnd.getTime(),
			});

			expect(historical.length).toBeGreaterThan(0);
			expect(historical?.[0]?.[0]).not.toBe(recent?.[0]?.[0]);
		});

		it("should throw if interval is invalid", async () => {
			await expect(
				client.klineData({ symbol: "BTCUSDT", interval: "nonsense" as unknown as FuturesKlineInterval })
			).rejects.toThrow();
		});
	});

	describe("/fapi/v1/continuousKlines - Continuous Contract Kline/Candlestick Data", () => {
		it("returns 500 entries by default", async () => {
			const data = await client.continuousContractKlineData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				interval: "1h",
			});
			expect(data.length).toBe(500);
		});

		it("respects provided limit = 240", async () => {
			const data = await client.continuousContractKlineData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				interval: "1h",
				limit: 240,
			});
			expect(data.length).toBe(240);
		});

		it("respects startTime and endTime", async () => {
			const start = subHours(new Date(), 5);
			const end = addHours(start, 2);

			const startTime = start.getTime();
			const endTime = end.getTime();

			const data = await client.continuousContractKlineData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				interval: "1h",
				startTime,
				endTime,
				limit: 10,
			});

			expect(data.length).toBeGreaterThan(0);
			expect(data?.[0]?.[0]).toBeGreaterThanOrEqual(startTime);
			expect(data?.[data.length - 1]?.[0]).toBeLessThanOrEqual(endTime);
		});

		it("throws on invalid contract type (runtime check)", async () => {
			await expect(
				client.continuousContractKlineData({
					pair: "BTCUSDT",
					contractType: "INVALID" as unknown as FuturesContractType,
					interval: "1h",
				})
			).rejects.toThrow();
		});
	});

	describe("/fapi/v1/indexPriceKlines - Index Price Kline/Candlestick Data", () => {
		it("returns default 500 candles if limit is not provided", async () => {
			const data = await client.indexPriceKlineData({
				pair: "BTCUSDT",
				interval: "1h",
			});
			expect(data.length).toBe(500);
		});

		it("respects provided limit = 30", async () => {
			const data = await client.indexPriceKlineData({
				pair: "BTCUSDT",
				interval: "1h",
				limit: 30,
			});
			expect(data.length).toBe(30);
		});

		it("respects startTime and endTime", async () => {
			const start = subHours(new Date(), 6);
			const end = addHours(start, 3);

			const startTime = start.getTime();
			const endTime = end.getTime();

			const data = await client.indexPriceKlineData({
				pair: "BTCUSDT",
				interval: "1h",
				startTime,
				endTime,
				limit: 10,
			});

			expect(data.length).toBeGreaterThan(0);
			expect(data?.[0]?.[0]).toBeGreaterThanOrEqual(startTime);
			expect(data?.[data.length - 1]?.[0]).toBeLessThanOrEqual(endTime);
		});
	});

	describe("/fapi/v1/markPriceKlines - Mark Price Kline/Candlestick Data", () => {
		it("returns 500 entries by default", async () => {
			const data = await client.markPriceKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
			});
			expect(data.length).toBe(500);
		});

		it("respects provided limit = 20", async () => {
			const data = await client.markPriceKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
				limit: 20,
			});
			expect(data.length).toBe(20);
		});

		it("respects startTime and endTime", async () => {
			const start = subHours(new Date(), 6);
			const end = addHours(start, 2);

			const startTime = start.getTime();
			const endTime = end.getTime();

			const data = await client.markPriceKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
				startTime,
				endTime,
				limit: 10,
			});

			expect(data.length).toBeGreaterThan(0);
			expect(data?.[0]?.[0]).toBeGreaterThanOrEqual(startTime);
			expect(data?.[data.length - 1]?.[0]).toBeLessThanOrEqual(endTime);
		});
	});

	describe("/fapi/v1/premiumIndexKlines - Premium index Kline Data", () => {
		it("returns 500 entries by default", async () => {
			const data = await client.premiumIndexKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
			});
			expect(data.length).toBe(500);
		});

		it("respects provided limit = 40", async () => {
			const data = await client.premiumIndexKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
				limit: 40,
			});
			expect(data.length).toBe(40);
		});

		it("respects startTime and endTime", async () => {
			const start = subHours(new Date(), 6);
			const end = addHours(start, 3);

			const startTime = start.getTime();
			const endTime = end.getTime();

			const data = await client.premiumIndexKlineData({
				symbol: "BTCUSDT",
				interval: "1h",
				startTime,
				endTime,
				limit: 10,
			});

			expect(data.length).toBeGreaterThan(0);
			expect(data?.[0]?.[0]).toBeGreaterThanOrEqual(startTime);
			expect(data?.[data.length - 1]?.[0]).toBeLessThanOrEqual(endTime);
		});
	});

	describe("/fapi/v1/premiumIndex - Mark Price", () => {
		it("returns single entry when symbol is provided", async () => {
			const result = await client.markPrice({ symbol: "BTCUSDT" });
			expect(result.symbol).toBe("BTCUSDT");
			expect(result).toHaveProperty("markPrice");
		});

		it("returns array of entries when no symbol is provided", async () => {
			const result = await client.markPrice();
			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty("markPrice");
		});
	});

	describe("/fapi/v1/fundingRate - Funding Rate History", () => {
		it("returns recent entries for BTCUSDT", async () => {
			const result = await client.fundingRateHistory({ symbol: "BTCUSDT", limit: 10 });
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeLessThanOrEqual(10);
			expect(result[0]).toHaveProperty("fundingRate");
		});

		it("respects startTime and endTime", async () => {
			const startTime = subDays(Date.now(), 3).getTime();
			const endTime = subDays(Date.now(), 2).getTime();

			const result = await client.fundingRateHistory({
				symbol: "BTCUSDT",
				startTime,
				endTime,
				limit: 20,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.fundingTime).toBeGreaterThanOrEqual(startTime);
			expect(result?.[result.length - 1]?.fundingTime).toBeLessThanOrEqual(endTime);
		});
	});

	describe("/fapi/v1/fundingInfo - Funding Rate Info", () => {
		it("returns a non-empty list of known symbol adjustments", async () => {
			const data = await client.fundingRateInfo();
			expect(data.length).toBeGreaterThan(0);
		});

		it("contains expected symbol BATUSDT", async () => {
			const data = await client.fundingRateInfo();
			const found = data.find((d) => d.symbol === "BATUSDT");
			expect(found).toBeDefined();
		});
	});

	describe("/fapi/v1/ticker/24hr - 24hr Ticker Price Change Statistics", () => {
		it("returns a single ticker entry when symbol is provided", async () => {
			const result = await client.ticker24h({ symbol: "BTCUSDT" });
			expect(result.symbol).toBe("BTCUSDT");
			expect(result.count).toBeGreaterThan(0);
		});

		it("returns many ticker entries when symbol is omitted", async () => {
			const result = await client.ticker24h();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(1);

			const sample = result.find((t) => t.symbol === "BTCUSDT");
			expect(sample).toBeDefined();
		});
	});

	describe("/fapi/v2/ticker/price - Symbol Price Ticker V2", () => {
		it("returns single symbol price when symbol is provided", async () => {
			const result = await client.symbolPriceTicker({ symbol: "BTCUSDT" });
			expect(result.symbol).toBe("BTCUSDT");
		});

		it("returns multiple symbol prices when symbol is omitted", async () => {
			const result = await client.symbolPriceTicker();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(1);

			const btc = result.find((r) => r.symbol === "BTCUSDT");
			expect(btc).toBeDefined();
		});
	});

	describe("/fapi/v1/ticker/bookTicker - Symbol Order Book Ticker", () => {
		it("returns single book ticker when symbol is provided", async () => {
			const result = await client.bookTicker({ symbol: "BTCUSDT" });

			expect(result.symbol).toBe("BTCUSDT");
		});

		it("returns multiple book tickers when symbol is omitted", async () => {
			const result = await client.bookTicker();
			expect(result.length).toBeGreaterThan(5);

			const btc = result.find((r) => r.symbol === "BTCUSDT");
			expect(btc).toBeDefined();
		});
	});

	describe("/futures/data/delivery-price - Quarterly Contract Settlement Price", () => {
		it("returns delivery price history for a given pair", async () => {
			const result = await client.quarterlySettlementPrices({ pair: "BTCUSDT" });

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v1/openInterest - Open Interest", () => {
		it("returns open interest for a specific symbol", async () => {
			const result = await client.openInterest({ symbol: "BTCUSDT" });
			expect(result.symbol).toBe("BTCUSDT");
		});
	});

	describe("/futures/data/openInterestHist - Open Interest Statistics", () => {
		it("returns recent open interest stats for BTCUSDT", async () => {
			const result = await client.openInterestStats({
				symbol: "BTCUSDT",
				period: "1h",
				limit: 10,
			});

			expect(result.length).toBeGreaterThan(0);
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.openInterestStats({
				symbol: "BTCUSDT",
				period: "4h",
				startTime: start,
				endTime: end,
				limit: 50,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.timestamp).toBeGreaterThanOrEqual(start);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/futures/data/topLongShortPositionRatio - Top Trader Long/Short Ratio (Positions)", () => {
		it("returns recent long/short ratio data", async () => {
			const result = await client.topLongShortPositionRatio({
				symbol: "BTCUSDT",
				period: "1h",
				limit: 10,
			});

			expect(result.length).toBeGreaterThan(0);
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.topLongShortPositionRatio({
				symbol: "BTCUSDT",
				period: "4h",
				startTime: start,
				endTime: end,
				limit: 50,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.timestamp).toBeGreaterThanOrEqual(start);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/futures/data/topLongShortAccountRatio - Top Trader Long/Short Ratio (Accounts)", () => {
		it("returns recent long/short account ratio data", async () => {
			const result = await client.topLongShortAccountRatio({
				symbol: "BTCUSDT",
				period: "1h",
				limit: 10,
			});

			expect(result.length).toBeGreaterThan(0);
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.topLongShortAccountRatio({
				symbol: "BTCUSDT",
				period: "4h",
				startTime: start,
				endTime: end,
				limit: 50,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.timestamp).toBeGreaterThanOrEqual(start);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/futures/data/globalLongShortAccountRatio - Long/Short Ratio (All Accounts)", () => {
		it("returns global long/short ratio data", async () => {
			const result = await client.globalLongShortAccountRatio({
				symbol: "BTCUSDT",
				period: "1h",
				limit: 10,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.longShortRatio).toBeGreaterThan(0);
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.globalLongShortAccountRatio({
				symbol: "BTCUSDT",
				period: "4h",
				startTime: start,
				endTime: end,
				limit: 50,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.timestamp).toBeGreaterThanOrEqual(start);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/futures/data/takerlongshortRatio - Taker Buy/Sell Volume", () => {
		it("returns recent taker buy/sell volume data", async () => {
			const result = await client.takerBuySellRatio({
				symbol: "BTCUSDT",
				period: "1h",
				limit: 10,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.buySellRatio).toBeGreaterThan(0);
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.takerBuySellRatio({
				symbol: "BTCUSDT",
				period: "4h",
				startTime: start,
				endTime: end,
				limit: 50,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result.some((r) => r.timestamp >= start && r.timestamp <= end)).toBe(true);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/futures/data/basis - Basis Data", () => {
		it("returns recent basis data for PERPETUAL", async () => {
			const result = await client.basisData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				period: "1h",
				limit: 20,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.basis).not.toBeNaN();
		});

		it("respects startTime and endTime", async () => {
			const start = subDays(new Date(), 2).getTime();
			const end = subDays(new Date(), 1).getTime();

			const result = await client.basisData({
				pair: "BTCUSDT",
				contractType: "PERPETUAL",
				period: "4h",
				limit: 50,
				startTime: start,
				endTime: end,
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result?.[0]?.timestamp).toBeGreaterThanOrEqual(start);
			expect(result?.[result.length - 1]?.timestamp).toBeLessThanOrEqual(end);
		});
	});

	describe("/fapi/v1/indexInfo - Composite Index Symbol Information", () => {
		it("returns an array of index info entries when no symbol is provided", async () => {
			const result = await client.compositeIndexInfo();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});

		it("returns a single index info entry when symbol is provided", async () => {
			const result = await client.compositeIndexInfo({ symbol: "BTCDOMUSDT" });
			expect(result.symbol).toBe("BTCDOMUSDT");
			expect(result.baseAssetList.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v1/assetIndex - Multi-Assets Mode Asset Index", () => {
		it("returns a single entry when symbol is provided", async () => {
			const result = await client.assetIndex({ symbol: "BTCUSD" });
			expect(result.symbol).toBe("BTCUSD");
			expect(result.index).toBeGreaterThan(0);
		});

		it("returns multiple entries when no symbol is provided", async () => {
			const result = await client.assetIndex();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v1/constituents - Query Index Price Constituents", () => {
		it("returns index price constituents for a symbol", async () => {
			const result = await client.indexPriceConstituents({ symbol: "BTCUSDT" });

			expect(result.symbol).toBe("BTCUSDT");
			expect(Array.isArray(result.constituents)).toBe(true);
			expect(result.constituents.length).toBeGreaterThan(0);
			expect(result.constituents[0]).toHaveProperty("exchange");
			expect(result.constituents[0]).toHaveProperty("price");
		});
	});

	describe("/fapi/v1/insuranceBalance - Insurance Fund Balance Snapshot", () => {
		it("returns a single object when symbol is provided", async () => {
			const result = await client.insuranceBalance({ symbol: "BTCUSDT" });

			expect(Array.isArray(result)).toBe(false);
			expect(result.symbols).toContain("BTCUSDT");
			expect(result.assets.length).toBeGreaterThan(0);
		});

		it("returns array of results when symbol is not provided", async () => {
			const result = await client.insuranceBalance();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result[0]).toHaveProperty("symbols");
			expect(result[0]).toHaveProperty("assets");
		});
	});

	describe("/fapi/v3/balance - Futures Account Balance V3 (USER_DATA)", () => {
		it("returns a array of assets", async () => {
			const result = await client.accountBalance();

			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v3/account - Futures Account Info V3", () => {
		it("returns current account information", async () => {
			const info = await client.accountInformation();

			expect(info.totalWalletBalance).toBeGreaterThanOrEqual(0);
			expect(Array.isArray(info.assets)).toBe(true);
			expect(Array.isArray(info.positions)).toBe(true);
		});
	});

	describe("/fapi/v1/commissionRate - User Commission Rate", () => {
		it("returns user's commission rates for BTCUSDT", async () => {
			const data = await client.userCommissionRate({ symbol: "BTCUSDT" });

			expect(data.symbol).toBe("BTCUSDT");
			expect(data.makerCommissionRate).toBeGreaterThanOrEqual(0);
			expect(data.takerCommissionRate).toBeGreaterThanOrEqual(0);
		});
	});

	describe("/fapi/v1/accountConfig - Futures Account Configuration", () => {
		it("successfully fetches account config and contains expected trading flags", async () => {
			const config = await client.accountConfig();

			expect(config.canTrade || config.canDeposit || config.canWithdraw).toBe(true);
		});
	});

	describe("/fapi/v1/symbolConfig - Symbol Configuration", () => {
		it("fetches config for all symbols", async () => {
			const result = await client.symbolConfig();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const sample = result.find((r) => r.symbol === "BTCUSDT");
			expect(sample).toBeDefined();
			expect(sample!.leverage).toBeGreaterThan(0);
		});

		it("fetches config for BTCUSDT only", async () => {
			const result = await client.symbolConfig({ symbol: "BTCUSDT" });

			expect(result.length).toBe(1);
			expect(result?.[0]?.symbol).toBe("BTCUSDT");
		});
	});

	describe("/fapi/v1/rateLimit/order - Query User Rate Limit", () => {
		it("returns rate limit entries for ORDERS", async () => {
			const limits = await client.userRateLimit();

			expect(Array.isArray(limits)).toBe(true);
			expect(limits.length).toBeGreaterThan(0);
			expect(limits.every((l) => l.rateLimitType === "ORDERS")).toBe(true);
		});
	});

	describe("/fapi/v1/leverageBracket - Notional and Leverage Brackets", () => {
		it("returns leverage brackets for all symbols", async () => {
			const result = await client.leverageBrackets();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			const btc = result.find((entry) => entry.symbol === "BTCUSDT");
			expect(btc).toBeDefined();
			expect(btc!.brackets.length).toBeGreaterThan(0);
		});

		it("returns leverage brackets for BTCUSDT only", async () => {
			const result = await client.leverageBrackets({ symbol: "BTCUSDT" });

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);
			expect(result?.[0]?.symbol).toBe("BTCUSDT");
			expect(result?.[0]?.brackets.length).toBeGreaterThan(0);
		});
	});

	describe("/fapi/v1/positionSide/dual - Get Current Position Mode", () => {
		it("returns the current user position mode", async () => {
			const result = await client.positionMode();

			expect(typeof result.dualSidePosition).toBe("boolean");
		});
	});

	describe("/fapi/v1/income - Get Income History", () => {
		it("returns recent income entries (default last 7 days)", async () => {
			const result = await client.incomeHistory();

			expect(Array.isArray(result)).toBe(true);

			expect(typeof result?.[0]?.income).toBe("number");
			expect(result[0]).toHaveProperty("incomeType");
			expect(result[0]).toHaveProperty("asset");
		});

		it("returns filtered income for BTCUSDT of type COMMISSION", async () => {
			const result = await client.incomeHistory({
				symbol: "BTCUSDT",
				incomeType: "COMMISSION",
				limit: 10,
			});

			expect(Array.isArray(result)).toBe(true);

			for (const entry of result) {
				expect(entry.symbol).toBe("BTCUSDT");
				expect(entry.incomeType).toBe("COMMISSION");
			}
		});
	});

	describe("Validation error", () => {
		it("Throws MalformedParamError error on malformed param", async () => {
			// @ts-expect-error
			await expect(client.klineData()).rejects.toThrowError(MalformedParamError);
		});
	});
});
