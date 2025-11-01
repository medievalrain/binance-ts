import { BaseRestClient } from "@/rest/base/base-rest-client";
import type {
	FuturesCheckServerTime,
	FuturesExchangeInfo,
	FuturesOrderBook,
	FuturesTrade,
	FuturesTestConnectivity,
	FuturesAggregateTrade,
	FuturesKlineInterval,
	FuturesKline,
	FuturesContractType,
	FuturesMarkPrice,
	FuturesFundingRate,
	FuturesFundingInfo,
	FuturesTicker24h,
	FuturesSymbolPrice,
	FuturesBookTicker,
	FuturesDeliveryPrice,
	FuturesOpenInterest,
	FuturesOpenInterestPeriod,
	FuturesOpenInterestStats,
	FuturesLongShortRatio,
	FuturesTakerBuySellRatio,
	FuturesBasis,
	FuturesCompositeIndex,
	FuturesAssetIndex,
	FuturesIndexPriceConstituents,
	FuturesInsuranceBalance,
	FuturesAccountBalance,
	FuturesAccountInfo,
	FuturesCommissionRate,
	FuturesAccountConfig,
	FuturesSymbolConfig,
	FuturesUserRateLimit,
	FuturesLeverageBracket,
	FuturesPositionMode,
	FuturesIncomeType,
	FuturesIncomeHistory,
	FuturesWorkingType,
	FuturesNewOrderRespType,
	FuturesOrderSide,
	FuturesOrderType,
	FuturesPositionSide,
	FuturesPriceMatch,
	FuturesSelfTradePrevention,
	FuturesTimeInForce,
	FuturesGetListenKey,
	FuturesNewOrder,
	FuturesModifyOrder,
	FuturesCancelOrder,
} from "./types";

export class FuturesRestClient extends BaseRestClient {
	constructor({
		baseUrl = "https://fapi.binance.com",
		apiKey,
		apiSecret,
	}: {
		apiKey?: string;
		apiSecret?: string;
		baseUrl?: string;
	}) {
		super({ baseUrl, apiKey, apiSecret });
	}

	public async testConnectivity(): Promise<FuturesTestConnectivity> {
		return this.marketRequest<FuturesCheckServerTime>({
			endpoint: "/fapi/v1/ping",
		});
	}
	public async checkServerTime(): Promise<FuturesCheckServerTime> {
		return this.marketRequest<FuturesCheckServerTime>({
			endpoint: "/fapi/v1/time",
		});
	}

	public async exchangeInformation(): Promise<FuturesExchangeInfo> {
		return this.marketRequest<FuturesExchangeInfo>({
			endpoint: "/fapi/v1/exchangeInfo",
		});
	}

	public async orderBook(params: { symbol: string; limit?: number }): Promise<FuturesOrderBook> {
		return this.marketRequest<FuturesOrderBook>({
			params,
			endpoint: "/fapi/v1/depth",
		});
	}

	public async recentTrades(params: { symbol: string; limit?: number }): Promise<FuturesTrade[]> {
		return this.marketRequest<FuturesTrade[]>({
			params,
			endpoint: "/fapi/v1/trades",
		});
	}

	public async oldTradesLookup(params: { symbol: string; limit?: number; fromId?: number }): Promise<FuturesTrade[]> {
		return this.privateRequest<FuturesTrade[]>({
			method: "GET",
			params,
			endpoint: "/fapi/v1/historicalTrades",
		});
	}

	public async aggregateTrades(params: {
		symbol: string;
		fromId?: number;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesAggregateTrade[]> {
		return this.marketRequest<FuturesAggregateTrade[]>({
			params,
			endpoint: "/fapi/v1/aggTrades",
		});
	}

	public async klineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesKline[]> {
		return this.marketRequest<FuturesKline[]>({
			params,
			endpoint: "/fapi/v1/klines",
		});
	}

	public async continuousContractKlineData(params: {
		pair: string;
		contractType: FuturesContractType;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesKline[]> {
		return this.marketRequest<FuturesKline[]>({
			params,
			endpoint: "/fapi/v1/continuousKlines",
		});
	}

	public async indexPriceKlineData(params: {
		pair: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesKline[]> {
		return this.marketRequest<FuturesKline[]>({
			params,
			endpoint: "/fapi/v1/indexPriceKlines",
		});
	}

	public async markPriceKlineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesKline[]> {
		return this.marketRequest<FuturesKline[]>({
			params,
			endpoint: "/fapi/v1/markPriceKlines",
		});
	}
	public async premiumIndexKlineData(params: {
		symbol: string;
		interval: FuturesKlineInterval;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesKline[]> {
		return this.marketRequest<FuturesKline[]>({
			params,
			endpoint: "/fapi/v1/premiumIndexKlines",
		});
	}

	public async markPrice(params: { symbol: string }): Promise<FuturesMarkPrice>;
	public async markPrice(): Promise<FuturesMarkPrice[]>;
	public async markPrice(params?: { symbol?: string }) {
		return this.marketRequest({
			params,
			endpoint: "/fapi/v1/premiumIndex",
		});
	}

	public async fundingRateHistory(params?: {
		symbol?: string;
		startTime?: number;
		endTime?: number;
		limit?: number;
	}): Promise<FuturesFundingRate[]> {
		return this.marketRequest<FuturesFundingRate[]>({
			params,
			endpoint: "/fapi/v1/fundingRate",
		});
	}

	public async fundingRateInfo(): Promise<FuturesFundingInfo[]> {
		return this.marketRequest<FuturesFundingInfo[]>({
			endpoint: "/fapi/v1/fundingInfo",
		});
	}

	public async ticker24h(params: { symbol: string }): Promise<FuturesTicker24h>;
	public async ticker24h(): Promise<FuturesTicker24h[]>;
	public async ticker24h(params?: { symbol?: string }) {
		return this.marketRequest({
			params,
			endpoint: "/fapi/v1/ticker/24hr",
		});
	}

	public async symbolPriceTicker(params: { symbol: string }): Promise<FuturesSymbolPrice>;
	public async symbolPriceTicker(): Promise<FuturesSymbolPrice[]>;
	public async symbolPriceTicker(params?: { symbol?: string }) {
		return this.marketRequest({
			params,
			endpoint: "/fapi/v2/ticker/price",
		});
	}

	public async bookTicker(params: { symbol: string }): Promise<FuturesBookTicker>;
	public async bookTicker(): Promise<FuturesBookTicker[]>;
	public async bookTicker(params?: { symbol?: string }) {
		return this.marketRequest({
			params,
			endpoint: "/fapi/v1/ticker/bookTicker",
		});
	}

	public async quarterlySettlementPrices(params: { pair: string }): Promise<FuturesDeliveryPrice[]> {
		return this.marketRequest<FuturesDeliveryPrice[]>({
			params,
			endpoint: "/futures/data/delivery-price",
		});
	}

	public async openInterest(params: { symbol: string }): Promise<FuturesOpenInterest> {
		return this.marketRequest<FuturesOpenInterest>({
			params,
			endpoint: "/fapi/v1/openInterest",
		});
	}

	public async openInterestStats(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesOpenInterestStats[]> {
		return this.marketRequest<FuturesOpenInterestStats[]>({
			params,
			endpoint: "/futures/data/openInterestHist",
		});
	}

	public async topLongShortPositionRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesLongShortRatio[]> {
		return this.marketRequest<FuturesLongShortRatio[]>({
			params,
			endpoint: "/futures/data/topLongShortPositionRatio",
		});
	}

	public async topLongShortAccountRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesLongShortRatio[]> {
		return this.marketRequest<FuturesLongShortRatio[]>({
			params,
			endpoint: "/futures/data/topLongShortAccountRatio",
		});
	}

	public async globalLongShortAccountRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesLongShortRatio[]> {
		return this.marketRequest<FuturesLongShortRatio[]>({
			params,
			endpoint: "/futures/data/globalLongShortAccountRatio",
		});
	}

	public async takerBuySellRatio(params: {
		symbol: string;
		period: FuturesOpenInterestPeriod;
		limit?: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesTakerBuySellRatio[]> {
		return this.marketRequest<FuturesTakerBuySellRatio[]>({
			params,
			endpoint: "/futures/data/takerlongshortRatio",
		});
	}

	public async basisData(params: {
		pair: string;
		contractType: FuturesContractType;
		period: FuturesOpenInterestPeriod;
		limit: number;
		startTime?: number;
		endTime?: number;
	}): Promise<FuturesBasis> {
		return this.marketRequest<FuturesBasis>({
			params,
			endpoint: "/futures/data/basis",
		});
	}

	public async compositeIndexInfo(params: { symbol: string }): Promise<FuturesCompositeIndex>;
	public async compositeIndexInfo(): Promise<FuturesCompositeIndex[]>;
	public async compositeIndexInfo(params?: { symbol?: string }) {
		const result = await this.marketRequest({
			params,
			endpoint: "/fapi/v1/indexInfo",
		});

		return result;
	}

	public async assetIndex(params: { symbol: string }): Promise<FuturesAssetIndex>;
	public async assetIndex(): Promise<FuturesAssetIndex[]>;
	public async assetIndex(params?: { symbol?: string }) {
		const result = await this.marketRequest({
			params,
			endpoint: "/fapi/v1/assetIndex",
		});

		return result;
	}

	public async indexPriceConstituents(params: { symbol: string }): Promise<FuturesIndexPriceConstituents> {
		return this.marketRequest<FuturesIndexPriceConstituents>({
			params,
			endpoint: "/fapi/v1/constituents",
		});
	}

	public async insuranceBalance(params: { symbol: string }): Promise<FuturesInsuranceBalance>;
	public async insuranceBalance(): Promise<FuturesInsuranceBalance[]>;
	public async insuranceBalance(params?: { symbol?: string }) {
		return this.marketRequest({
			params,
			endpoint: "/fapi/v1/insuranceBalance",
		});
	}

	public async accountBalance(): Promise<FuturesAccountBalance[]> {
		return this.privateRequest<FuturesAccountBalance[]>({
			method: "GET",
			endpoint: "/fapi/v3/balance",
		});
	}

	public async accountInformation(): Promise<FuturesAccountInfo> {
		return this.privateRequest<FuturesAccountInfo>({
			method: "GET",
			endpoint: "/fapi/v3/account",
		});
	}

	public async userCommissionRate(params: { symbol: string }): Promise<FuturesCommissionRate> {
		return this.privateRequest<FuturesCommissionRate>({
			method: "GET",
			endpoint: "/fapi/v1/commissionRate",
			params,
		});
	}

	public async accountConfig(): Promise<FuturesAccountConfig> {
		return this.privateRequest<FuturesAccountConfig>({
			method: "GET",
			endpoint: "/fapi/v1/accountConfig",
		});
	}

	public async symbolConfig(params?: { symbol?: string }): Promise<FuturesSymbolConfig[]> {
		return this.privateRequest<FuturesSymbolConfig[]>({
			method: "GET",
			endpoint: "/fapi/v1/symbolConfig",
			params,
		});
	}
	public async userRateLimit(): Promise<FuturesUserRateLimit[]> {
		return this.privateRequest<FuturesUserRateLimit[]>({
			method: "GET",
			endpoint: "/fapi/v1/rateLimit/order",
		});
	}

	public async leverageBrackets(params?: { symbol?: string }): Promise<FuturesLeverageBracket[]> {
		return this.privateRequest<FuturesLeverageBracket[]>({
			method: "GET",
			endpoint: "/fapi/v1/leverageBracket",
			params,
		});
	}

	public async positionMode(): Promise<FuturesPositionMode> {
		return this.privateRequest<FuturesPositionMode>({
			method: "GET",
			endpoint: "/fapi/v1/positionSide/dual",
		});
	}

	public async incomeHistory(params?: {
		symbol?: string;
		incomeType?: FuturesIncomeType;
		startTime?: number;
		endTime?: number;
		page?: number;
		limit?: number;
	}): Promise<FuturesIncomeHistory[]> {
		return this.privateRequest<FuturesIncomeHistory[]>({
			method: "GET",
			endpoint: "/fapi/v1/income",
			params,
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
	}): Promise<FuturesNewOrder> {
		return this.privateRequest<FuturesNewOrder>({
			method: "POST",
			endpoint: "/fapi/v1/order",
			params,
		});
	}

	public async getListenKey(): Promise<FuturesGetListenKey> {
		return this.privateRequest<FuturesGetListenKey>({
			method: "POST",
			endpoint: "/fapi/v1/listenKey",
		});
	}

	public async modifyOrder(params: {
		orderId?: number;
		origClientOrderId?: string;
		symbol: string;
		side: FuturesOrderSide;
		quantity: number;
		price: number;
		priceMatch?: FuturesPriceMatch;
		recvWindow?: number;
	}): Promise<FuturesModifyOrder> {
		return this.privateRequest<FuturesModifyOrder>({
			method: "PUT",
			endpoint: "/fapi/v1/order",
			params,
		});
	}

	public async cancelOrder(params: {
		orderId?: number;
		origClientOrderId?: string;
		symbol: string;
		recvWindow?: number;
	}): Promise<FuturesCancelOrder> {
		return this.privateRequest<FuturesCancelOrder>({
			method: "DELETE",
			endpoint: "/fapi/v1/order",
			params,
		});
	}
}
