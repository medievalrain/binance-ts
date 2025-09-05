import type z from "zod";
import type {
	FuturesTestConnectivitySchema,
	FuturesCheckServerTimeSchema,
	FuturesExchangeInfoRateLimitSchema,
	FuturesExchangeInfoAssetSchema,
	FuturesExchangeInfoFilterSchema,
	FuturesExchangeInfoSymbolSchema,
	FuturesExchangeInfoSchema,
	FuturesOrderBookSchema,
	FuturesRecentTradesSchema,
	FuturesOldTradesLookupSchema,
	FuturesAggregateTradesSchema,
	FuturesKlineDataSchema,
	FuturesMarkPriceSchema,
	FuturesFundingRateEntrySchema,
	FuturesFundingRateSchema,
	FuturesFundingInfoEntrySchema,
	FuturesFundingInfoSchema,
	FuturesTicker24hSchema,
	FuturesSymbolPriceSchema,
	FuturesBookTickerSchema,
	FuturesDeliveryPriceSchema,
	FuturesOpenInterestSchema,
	FuturesOpenInterestStatsSchema,
	FuturesLongShortRatioSchema,
	FuturesTakerBuySellRatioItemSchema,
	FuturesTakerBuySellRatioSchema,
	FuturesBasisSchema,
	FuturesCompositeIndexAssetSchema,
	FuturesCompositeIndexSchema,
	FuturesAssetIndexSchema,
	FuturesIndexPriceConstituentItemSchema,
	FuturesIndexPriceConstituentsSchema,
	FuturesInsuranceBalanceAssetSchema,
	FuturesInsuranceBalanceEntrySchema,
	FuturesAccountBalanceSchema,
	FuturesAccountAssetSchema,
	FuturesAccountPositionSchema,
	FuturesAccountInfoSchema,
	FuturesCommissionRateSchema,
	FuturesAccountConfigSchema,
	FuturesSymbolConfigSchema,
	FuturesUserRateLimitSchema,
	FuturesLeverageBracketEntrySchema,
	FuturesLeverageBracketSchema,
	FuturesPositionModeSchema,
	FuturesIncomeTypeSchema,
	FuturesIncomeHistorySchema,
	FuturesOrderSideSchema,
	FuturesPositionSideSchema,
	FuturesOrderTypeSchema,
	FuturesTimeInForceSchema,
	FuturesWorkingTypeSchema,
	FuturesNewOrderRespTypeSchema,
	FuturesPriceMatchSchema,
	FuturesSelfTradePreventionSchema,
	FuturesNewOrderSchema,
	FuturesContractTypeSchema,
	FuturesUnderlyingTypeSchema,
} from "./schema";

export type FuturesKlineInterval = "1s" | "1m" | "3m" | "5m" | "30m" | "1h" | "2h" | "6h" | "8h" | "12h" | "3d" | "1M";
export type FuturesContractType = z.infer<typeof FuturesContractTypeSchema>;
export type FuturesUnderlyingType = z.infer<typeof FuturesUnderlyingTypeSchema>;

export type FuturesOpenInterestPeriod = "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "12h" | "1d";

export type FuturesTestConnectivity = z.infer<typeof FuturesTestConnectivitySchema>;
export type FuturesCheckServerTime = z.infer<typeof FuturesCheckServerTimeSchema>;

export type FuturesExchangeInfoRateLimit = z.infer<typeof FuturesExchangeInfoRateLimitSchema>;
export type FuturesExchangeInfoAsset = z.infer<typeof FuturesExchangeInfoAssetSchema>;
export type FuturesExchangeInfoFilter = z.infer<typeof FuturesExchangeInfoFilterSchema>;
export type FuturesExchangeInfoSymbol = z.infer<typeof FuturesExchangeInfoSymbolSchema>;
export type FuturesExchangeInfo = z.infer<typeof FuturesExchangeInfoSchema>;

export type FuturesOrderBook = z.infer<typeof FuturesOrderBookSchema>;

export type FuturesRecentTrades = z.infer<typeof FuturesRecentTradesSchema>;
export type FuturesOldTradesLookup = z.infer<typeof FuturesOldTradesLookupSchema>;
export type FuturesggregateTrades = z.infer<typeof FuturesAggregateTradesSchema>;

export type KlineData = z.infer<typeof FuturesKlineDataSchema>;

export type MarkPrice = z.infer<typeof FuturesMarkPriceSchema>;

export type FundingRateEntry = z.infer<typeof FuturesFundingRateEntrySchema>;
export type FundingRate = z.infer<typeof FuturesFundingRateSchema>;
export type FundingInfoEntry = z.infer<typeof FuturesFundingInfoEntrySchema>;
export type FundingInfo = z.infer<typeof FuturesFundingInfoSchema>;

export type FuturesTicker24h = z.infer<typeof FuturesTicker24hSchema>;

export type FuturesSymbolPrice = z.infer<typeof FuturesSymbolPriceSchema>;

export type FuturesBookTicker = z.infer<typeof FuturesBookTickerSchema>;

export type FuturesDeliveryPrice = z.infer<typeof FuturesDeliveryPriceSchema>;

export type FuturesOpenInterest = z.infer<typeof FuturesOpenInterestSchema>;
export type FuturesOpenInterestStats = z.infer<typeof FuturesOpenInterestStatsSchema>;
export type FuturesLongShortRatio = z.infer<typeof FuturesLongShortRatioSchema>;

export type FuturesTakerBuySellRatioItem = z.infer<typeof FuturesTakerBuySellRatioItemSchema>;
export type FuturesTakerBuySellRatio = z.infer<typeof FuturesTakerBuySellRatioSchema>;

export type FuturesBasis = z.infer<typeof FuturesBasisSchema>;

export type FuturesCompositeIndexAsset = z.infer<typeof FuturesCompositeIndexAssetSchema>;
export type FuturesCompositeIndex = z.infer<typeof FuturesCompositeIndexSchema>;

export type FuturesAssetIndex = z.infer<typeof FuturesAssetIndexSchema>;

export type FuturesIndexPriceConstituent = z.infer<typeof FuturesIndexPriceConstituentItemSchema>;
export type FuturesIndexPriceConstituents = z.infer<typeof FuturesIndexPriceConstituentsSchema>;

export type FuturesInsuranceBalanceAsset = z.infer<typeof FuturesInsuranceBalanceAssetSchema>;
export type FuturesInsuranceBalanceEntry = z.infer<typeof FuturesInsuranceBalanceEntrySchema>;

export type FuturesAccountBalance = z.infer<typeof FuturesAccountBalanceSchema>;

export type FuturesAccountAsset = z.infer<typeof FuturesAccountAssetSchema>;
export type FuturesAccountPosition = z.infer<typeof FuturesAccountPositionSchema>;
export type FuturesAccountInfo = z.infer<typeof FuturesAccountInfoSchema>;

export type FuturesCommissionRate = z.infer<typeof FuturesCommissionRateSchema>;

export type FuturesAccountConfig = z.infer<typeof FuturesAccountConfigSchema>;

export type FuturesSymbolConfig = z.infer<typeof FuturesSymbolConfigSchema>;
export type FuturesUserRateLimit = z.infer<typeof FuturesUserRateLimitSchema>;

export type FuturesLeverageBracketEntry = z.infer<typeof FuturesLeverageBracketEntrySchema>;
export type FuturesLeverageBracket = z.infer<typeof FuturesLeverageBracketSchema>;

export type FuturesPositionMode = z.infer<typeof FuturesPositionModeSchema>;

export type FuturesIncomeType = z.infer<typeof FuturesIncomeTypeSchema>;
export type FuturesIncomeHistory = z.infer<typeof FuturesIncomeHistorySchema>;

export type FuturesOrderSide = z.infer<typeof FuturesOrderSideSchema>;
export type FuturesPositionSide = z.infer<typeof FuturesPositionSideSchema>;
export type FuturesOrderType = z.infer<typeof FuturesOrderTypeSchema>;
export type FuturesTimeInForce = z.infer<typeof FuturesTimeInForceSchema>;
export type FuturesWorkingType = z.infer<typeof FuturesWorkingTypeSchema>;
export type FuturesNewOrderRespType = z.infer<typeof FuturesNewOrderRespTypeSchema>;
export type FuturesPriceMatch = z.infer<typeof FuturesPriceMatchSchema>;
export type FuturesSelfTradePrevention = z.infer<typeof FuturesSelfTradePreventionSchema>;

export type FuturesNewOrder = z.infer<typeof FuturesNewOrderSchema>;
