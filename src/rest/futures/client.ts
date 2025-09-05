import {
	FuturesAccountBalanceSchema,
	FuturesAggregateTradesSchema,
	FuturesAssetIndexSchema,
	FuturesBasisSchema,
	FuturesBookTickerSchema,
	FuturesCheckServerTimeSchema,
	FuturesCommissionRateSchema,
	FuturesCompositeIndexSchema,
	FuturesDeliveryPriceSchema,
	FuturesExchangeInfoSchema,
	FuturesFundingInfoSchema,
	FuturesFundingRateSchema,
	FuturesAccountConfigSchema,
	FuturesAccountInfoSchema,
	FuturesIncomeHistorySchema,
	FuturesIncomeTypeSchema,
	FuturesIndexPriceConstituentsSchema,
	FuturesInsuranceBalanceEntrySchema,
	FuturesKlineDataSchema,
	FuturesLeverageBracketSchema,
	FuturesLongShortRatioSchema,
	FuturesMarkPriceSchema,
	FuturesNewOrderSchema,
	FuturesOldTradesLookupSchema,
	FuturesOpenInterestSchema,
	FuturesOpenInterestStatsSchema,
	FuturesOrderBookSchema,
	FuturesPositionModeSchema,
	FuturesRecentTradesSchema,
	FuturesSymbolConfigSchema,
	FuturesSymbolPriceSchema,
	FuturesTakerBuySellRatioSchema,
	FuturesTestConnectivitySchema,
	FuturesTicker24hSchema,
	FuturesUserRateLimitSchema,
} from "./schema";
import { BaseRestClient } from "@/shared/base-rest-client";

import type {
	FuturesKlineInterval,
	FuturesContractType,
	FuturesOpenInterestPeriod,
	MarkPrice,
	FuturesTicker24h,
	FuturesSymbolPrice,
	FuturesBookTicker,
	FuturesCompositeIndex,
	FuturesAssetIndex,
	FuturesInsuranceBalanceEntry,
	FuturesOrderSide,
	FuturesOrderType,
	FuturesPositionSide,
	FuturesTimeInForce,
	FuturesWorkingType,
	FuturesNewOrderRespType,
	FuturesPriceMatch,
	FuturesSelfTradePrevention,
	FuturesTestConnectivity,
	FuturesCheckServerTime,
} from "./types";
import type { ApiCredentials } from "@/types";
import z from "zod";
import { Client } from "undici";

export class FuturesRestClient extends BaseRestClient {
	constructor({
		baseUrl = "https://fapi.binance.com",
		credentials,
		httpOptions,
	}: {
		credentials?: ApiCredentials;
		baseUrl?: string;
		httpOptions?: Client.Options;
	}) {
		super({ baseUrl, credentials, httpOptions });
	}

	public async testConnectivity(): Promise<FuturesTestConnectivity> {
		return this.publicRequest({
			endpoint: "/fapi/v1/ping",
			schema: FuturesTestConnectivitySchema,
		});
	}
	public async checkServerTime(): Promise<FuturesCheckServerTime> {
		return this.publicRequest({
			endpoint: "/fapi/v1/time",
			schema: FuturesCheckServerTimeSchema,
		});
	}
	public async exchangeInformation() {
		return this.publicRequest({
			endpoint: "/fapi/v1/exchangeInfo",
			schema: FuturesExchangeInfoSchema,
		});
	}

	public async orderBook(params: { symbol: string; limit?: number }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/depth",
			schema: FuturesOrderBookSchema,
		});
	}

	public async recentTrades(params: { symbol: string; limit?: number }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/trades",
			schema: FuturesRecentTradesSchema,
		});
	}

	public async oldTradesLookup(params: { symbol: string; limit?: number; fromId?: number }) {
		return this.privateRequest({
			method: "GET",
			params,
			endpoint: "/fapi/v1/historicalTrades",
			schema: FuturesOldTradesLookupSchema,
		});
	}

	public async aggregateTrades(params: {
		symbol: string;
		fromId?: number;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/aggTrades",
			schema: FuturesAggregateTradesSchema,
		});
	}

	public async klineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/klines",
			schema: FuturesKlineDataSchema,
		});
	}

	public async continuousContractKlineData(params: {
		pair: string;
		contractType: FuturesContractType;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/continuousKlines",
			schema: FuturesKlineDataSchema,
		});
	}

	public async indexPriceKlineData(params: {
		pair: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/indexPriceKlines",
			schema: FuturesKlineDataSchema,
		});
	}

	public async markPriceKlineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/markPriceKlines",
			schema: FuturesKlineDataSchema,
		});
	}
	public async premiumIndexKlineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/premiumIndexKlines",
			schema: FuturesKlineDataSchema,
		});
	}

	public async markPrice(params: { symbol: string }): Promise<MarkPrice>;
	public async markPrice(): Promise<MarkPrice[]>;
	public async markPrice(params?: { symbol?: string }) {
		const isSingle = !!params?.symbol;

		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/premiumIndex",
			schema: isSingle ? FuturesMarkPriceSchema : z.array(FuturesMarkPriceSchema),
		});
	}

	public async fundingRateHistory(params?: { symbol?: string; startTime?: number; endTime?: number; limit?: number }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/fundingRate",
			schema: FuturesFundingRateSchema,
		});
	}

	public async fundingRateInfo() {
		return this.publicRequest({
			endpoint: "/fapi/v1/fundingInfo",
			schema: FuturesFundingInfoSchema,
		});
	}

	public async ticker24h(params: { symbol: string }): Promise<FuturesTicker24h>;
	public async ticker24h(): Promise<FuturesTicker24h[]>;
	public async ticker24h(params?: { symbol?: string }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/ticker/24hr",
			schema: params?.symbol ? FuturesTicker24hSchema : z.array(FuturesTicker24hSchema),
		});
	}

	public async symbolPriceTicker(params: { symbol: string }): Promise<FuturesSymbolPrice>;
	public async symbolPriceTicker(): Promise<FuturesSymbolPrice[]>;
	public async symbolPriceTicker(params?: { symbol?: string }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v2/ticker/price",
			schema: params?.symbol ? FuturesSymbolPriceSchema : z.array(FuturesSymbolPriceSchema),
		});
	}

	public async bookTicker(params: { symbol: string }): Promise<FuturesBookTicker>;
	public async bookTicker(): Promise<FuturesBookTicker[]>;
	public async bookTicker(params?: { symbol?: string }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/ticker/bookTicker",
			schema: params?.symbol ? FuturesBookTickerSchema : z.array(FuturesBookTickerSchema),
		});
	}

	public async quarterlySettlementPrices(params: { pair: string }) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/delivery-price",
			schema: FuturesDeliveryPriceSchema,
		});
	}

	public async openInterest(params: { symbol: string }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/openInterest",
			schema: FuturesOpenInterestSchema,
		});
	}

	public async openInterestStats(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/openInterestHist",
			schema: FuturesOpenInterestStatsSchema,
		});
	}

	public async topLongShortPositionRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/topLongShortPositionRatio",
			schema: FuturesLongShortRatioSchema,
		});
	}

	public async topLongShortAccountRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/topLongShortAccountRatio",
			schema: FuturesLongShortRatioSchema,
		});
	}

	public async globalLongShortAccountRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/globalLongShortAccountRatio",
			schema: FuturesLongShortRatioSchema,
		});
	}

	public async takerBuySellRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/takerlongshortRatio",
			schema: FuturesTakerBuySellRatioSchema,
		});
	}

	public async basisData(params: {
		pair: string;
		contractType: FuturesContractType;
		period: FuturesOpenInterestPeriod;
		limit: number;
		startTime?: number;
		endTime?: number;
	}) {
		return this.publicRequest({
			params,
			endpoint: "/futures/data/basis",
			schema: FuturesBasisSchema,
		});
	}

	public async compositeIndexInfo(params: { symbol: string }): Promise<FuturesCompositeIndex>;
	public async compositeIndexInfo(): Promise<FuturesCompositeIndex[]>;
	public async compositeIndexInfo(params?: { symbol?: string }) {
		const isSingle = !!params?.symbol;

		const result = await this.publicRequest({
			params,
			endpoint: "/fapi/v1/indexInfo",
			schema: isSingle ? FuturesCompositeIndexSchema : z.array(FuturesCompositeIndexSchema),
		});

		return result;
	}

	public async assetIndex(params: { symbol: string }): Promise<FuturesAssetIndex>;
	public async assetIndex(): Promise<FuturesAssetIndex[]>;
	public async assetIndex(params?: { symbol?: string }) {
		const result = await this.publicRequest({
			params,
			endpoint: "/fapi/v1/assetIndex",
			schema: params?.symbol ? FuturesAssetIndexSchema : z.array(FuturesAssetIndexSchema),
		});

		return result;
	}

	public async indexPriceConstituents(params: { symbol: string }) {
		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/constituents",
			schema: FuturesIndexPriceConstituentsSchema,
		});
	}

	public async insuranceBalance(params: { symbol: string }): Promise<FuturesInsuranceBalanceEntry>;
	public async insuranceBalance(): Promise<FuturesInsuranceBalanceEntry[]>;
	public async insuranceBalance(params?: { symbol?: string }) {
		const isSingle = !!params?.symbol;

		return this.publicRequest({
			params,
			endpoint: "/fapi/v1/insuranceBalance",
			schema: isSingle ? FuturesInsuranceBalanceEntrySchema : z.array(FuturesInsuranceBalanceEntrySchema),
		});
	}

	public async accountBalance() {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v3/balance",
			schema: FuturesAccountBalanceSchema,
		});
	}

	public async accountInformation() {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v3/account",
			schema: FuturesAccountInfoSchema,
		});
	}

	public async userCommissionRate(params: { symbol: string }) {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/commissionRate",
			params,
			schema: FuturesCommissionRateSchema,
		});
	}

	public async accountConfig() {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/accountConfig",
			schema: FuturesAccountConfigSchema,
		});
	}

	public async symbolConfig(params?: { symbol?: string }) {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/symbolConfig",
			params,
			schema: FuturesSymbolConfigSchema,
		});
	}

	public async userRateLimit() {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/rateLimit/order",
			schema: FuturesUserRateLimitSchema,
		});
	}

	public async leverageBrackets(params?: { symbol?: string }) {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/leverageBracket",
			params,
			schema: FuturesLeverageBracketSchema,
		});
	}

	public async positionMode() {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/positionSide/dual",
			schema: FuturesPositionModeSchema,
		});
	}

	public async incomeHistory(params?: {
		symbol?: string;
		incomeType?: z.infer<typeof FuturesIncomeTypeSchema>;
		startTime?: number;
		endTime?: number;
		page?: number;
		limit?: number;
	}) {
		return this.privateRequest({
			method: "GET",
			endpoint: "/fapi/v1/income",
			params,
			schema: FuturesIncomeHistorySchema,
		});
	}
	public async newOrder(params: {
		symbol: string;
		side: FuturesOrderSide;
		type: FuturesOrderType;
		positionSide?: FuturesPositionSide;
		timeInForce?: FuturesTimeInForce;
		reduceOnly?: "true" | "false";
		quantity?: number;
		price?: number;
		newClientOrderId?: string;
		stopPrice?: number;
		closePosition?: "true" | "false";
		activationPrice?: number;
		callbackRate?: number;
		workingType?: FuturesWorkingType;
		priceProtect?: "TRUE" | "FALSE";
		newOrderRespType?: FuturesNewOrderRespType;
		priceMatch?: FuturesPriceMatch;
		selfTradePreventionMode?: FuturesSelfTradePrevention;
		goodTillDate?: number;
		recvWindow?: number;
	}) {
		return this.privateRequest({
			method: "POST",
			endpoint: "/fapi/v1/order",
			params,
			schema: FuturesNewOrderSchema,
		});
	}
}
