import { z } from "zod";

export const FuturesTestConnectivitySchema = z.object({});
export const FuturesCheckServerTimeSchema = z.object({ serverTime: z.number() });

export const FuturesExchangeInfoRateLimitSchema = z.object({
	interval: z.enum(["MINUTE", "SECOND"]),
	intervalNum: z.number(),
	limit: z.number(),
	rateLimitType: z.enum(["REQUEST_WEIGHT", "ORDERS"]),
});

export const FuturesExchangeInfoAssetSchema = z.object({
	asset: z.string(),
	marginAvailable: z.boolean(),
	autoAssetExchange: z.string().nullable(),
});

export const FuturesExchangeInfoFilterSchema = z.discriminatedUnion("filterType", [
	z.object({
		filterType: z.literal("PRICE_FILTER"),
		maxPrice: z.coerce.number(),
		minPrice: z.coerce.number(),
		tickSize: z.coerce.number(),
	}),
	z.object({
		filterType: z.literal("LOT_SIZE"),
		maxQty: z.coerce.number(),
		minQty: z.coerce.number(),
		stepSize: z.coerce.number(),
	}),
	z.object({
		filterType: z.literal("MARKET_LOT_SIZE"),
		maxQty: z.coerce.number(),
		minQty: z.coerce.number(),
		stepSize: z.coerce.number(),
	}),
	z.object({
		filterType: z.literal("MAX_NUM_ORDERS"),
		limit: z.number(),
	}),
	z.object({
		filterType: z.literal("MAX_NUM_ALGO_ORDERS"),
		limit: z.number(),
	}),
	z.object({
		filterType: z.literal("MIN_NOTIONAL"),
		notional: z.string(),
	}),
	z.object({
		filterType: z.literal("PERCENT_PRICE"),
		multiplierUp: z.coerce.number(),
		multiplierDown: z.coerce.number().optional(),
		multiplierDecimal: z.coerce.number().optional(),
	}),
	z.object({
		filterType: z.literal("POSITION_RISK_CONTROL"),
		positionControlSide: z.literal("NONE"),
		multiplierDown: z.coerce.number().optional(),
		multiplierDecimal: z.coerce.number().optional(),
	}),
]);

export const FuturesContractTypeSchema = z.enum(["PERPETUAL", "CURRENT_QUARTER", "NEXT_QUARTER"]);
export const FuturesUnderlyingTypeSchema = z.enum(["COIN", "INDEX", "PREMARKET"]);

export const FuturesOrderTypeSchema = z.enum([
	"LIMIT",
	"MARKET",
	"STOP",
	"TAKE_PROFIT",
	"STOP_MARKET",
	"TAKE_PROFIT_MARKET",
	"TRAILING_STOP_MARKET",
]);

export const FuturesExchangeInfoSymbolSchema = z.object({
	symbol: z.string(),
	pair: z.string(),
	contractType: FuturesContractTypeSchema,
	deliveryDate: z.number(),
	onboardDate: z.number(),
	status: z.enum(["TRADING", "SETTLING", "PENDING_TRADING"]),
	maintMarginPercent: z.string(),
	requiredMarginPercent: z.string(),
	baseAsset: z.string(),
	quoteAsset: z.string(),
	marginAsset: z.string(),
	pricePrecision: z.number(),
	quantityPrecision: z.number(),
	baseAssetPrecision: z.number(),
	quotePrecision: z.number(),
	underlyingType: FuturesUnderlyingTypeSchema,
	underlyingSubType: z.array(z.string()),
	permissionSets: z.array(z.enum(["COPY", "GRID"])),
	settlePlan: z.number().optional(),
	triggerProtect: z.string(),
	filters: z.array(FuturesExchangeInfoFilterSchema),
	OrderType: z.array(FuturesOrderTypeSchema).optional(),
	timeInForce: z.array(z.string()),
	liquidationFee: z.coerce.number(),
	marketTakeBound: z.coerce.number(),
});

export const FuturesExchangeInfoSchema = z.object({
	exchangeFilters: z.array(z.unknown()),
	rateLimits: z.array(FuturesExchangeInfoRateLimitSchema),
	serverTime: z.number(),
	assets: z.array(FuturesExchangeInfoAssetSchema),
	symbols: z.array(FuturesExchangeInfoSymbolSchema),
	timezone: z.string(),
});

export const FuturesOrderBookSchema = z.object({
	lastUpdateId: z.number(),
	E: z.number(),
	T: z.number(),
	bids: z.array(z.tuple([z.coerce.number(), z.coerce.number()])),
	asks: z.array(z.tuple([z.coerce.number(), z.coerce.number()])),
});

export const FuturesRecentTradesSchema = z.array(
	z.object({
		id: z.number(),
		price: z.coerce.number(),
		qty: z.coerce.number(),
		quoteQty: z.coerce.number(),
		time: z.number(),
		isBuyerMaker: z.boolean(),
	})
);

export const FuturesOldTradesLookupSchema = z.array(
	z.object({
		id: z.number(),
		price: z.coerce.number(),
		qty: z.coerce.number(),
		quoteQty: z.coerce.number(),
		time: z.number(),
		isBuyerMaker: z.boolean(),
	})
);

export const FuturesAggregateTradesSchema = z.array(
	z.object({
		a: z.number(),
		p: z.coerce.number(),
		q: z.coerce.number(),
		f: z.number(),
		l: z.number(),
		T: z.number(),
		m: z.boolean(),
	})
);

export const FuturesKlineDataSchema = z.array(
	z.tuple([
		z.number(),
		z.coerce.number(),
		z.coerce.number(),
		z.coerce.number(),
		z.coerce.number(),
		z.coerce.number(),
		z.number(),
		z.coerce.number(),
		z.number(),
		z.coerce.number(),
		z.coerce.number(),
		z.coerce.number(),
	])
);

export const FuturesMarkPriceSchema = z.object({
	symbol: z.string(),
	markPrice: z.coerce.number(),
	indexPrice: z.coerce.number(),
	estimatedSettlePrice: z.coerce.number(),
	lastFundingRate: z.coerce.number(),
	interestRate: z.coerce.number(),
	nextFundingTime: z.number(),
	time: z.number(),
});

export const FuturesFundingRateEntrySchema = z.object({
	symbol: z.string(),
	fundingRate: z.coerce.number(),
	fundingTime: z.number(),
	markPrice: z.coerce.number(),
});
export const FuturesFundingRateSchema = z.array(FuturesFundingRateEntrySchema);

export const FuturesFundingInfoEntrySchema = z.object({
	symbol: z.string(),
	adjustedFundingRateCap: z.coerce.number(),
	adjustedFundingRateFloor: z.coerce.number(),
	fundingIntervalHours: z.number(),
});
export const FuturesFundingInfoSchema = z.array(FuturesFundingInfoEntrySchema);

export const FuturesTicker24hSchema = z.object({
	symbol: z.string(),
	priceChange: z.coerce.number(),
	priceChangePercent: z.coerce.number(),
	weightedAvgPrice: z.coerce.number(),
	lastPrice: z.coerce.number(),
	lastQty: z.coerce.number(),
	openPrice: z.coerce.number(),
	highPrice: z.coerce.number(),
	lowPrice: z.coerce.number(),
	volume: z.coerce.number(),
	quoteVolume: z.coerce.number(),
	openTime: z.number(),
	closeTime: z.number(),
	firstId: z.number(),
	lastId: z.number(),
	count: z.number(),
});

export const FuturesSymbolPriceSchema = z.object({
	symbol: z.string(),
	price: z.coerce.number(),
	time: z.number(),
});

export const FuturesBookTickerSchema = z.object({
	symbol: z.string(),
	bidPrice: z.coerce.number(),
	bidQty: z.coerce.number(),
	askPrice: z.coerce.number(),
	askQty: z.coerce.number(),
	time: z.coerce.number(),
});

export const FuturesDeliveryPriceSchema = z.array(
	z.object({
		deliveryTime: z.coerce.number(),
		deliveryPrice: z.coerce.number(),
	})
);

export const FuturesOpenInterestSchema = z.object({
	openInterest: z.coerce.number(),
	symbol: z.string(),
	time: z.coerce.number(),
});

export const FuturesOpenInterestStatsSchema = z.array(
	z.object({
		symbol: z.string(),
		sumOpenInterest: z.coerce.number(),
		sumOpenInterestValue: z.coerce.number(),
		timestamp: z.coerce.number(),
	})
);

export const FuturesLongShortRatioSchema = z.array(
	z.object({
		symbol: z.string(),
		longShortRatio: z.coerce.number(),
		longAccount: z.coerce.number(),
		shortAccount: z.coerce.number(),
		timestamp: z.coerce.number(),
	})
);

export const FuturesTakerBuySellRatioItemSchema = z.object({
	buySellRatio: z.coerce.number(),
	buyVol: z.coerce.number(),
	sellVol: z.coerce.number(),
	timestamp: z.coerce.number(),
});
export const FuturesTakerBuySellRatioSchema = z.array(FuturesTakerBuySellRatioItemSchema);

export const FuturesBasisSchema = z.array(
	z.object({
		indexPrice: z.coerce.number(),
		contractType: FuturesContractTypeSchema,
		basisRate: z.coerce.number(),
		futuresPrice: z.coerce.number(),
		annualizedBasisRate: z.string().optional(),
		basis: z.coerce.number(),
		pair: z.string(),
		timestamp: z.number(),
	})
);

export const FuturesCompositeIndexAssetSchema = z.object({
	baseAsset: z.string(),
	quoteAsset: z.string(),
	weightInQuantity: z.coerce.number(),
	weightInPercentage: z.coerce.number(),
});

export const FuturesCompositeIndexSchema = z.object({
	symbol: z.string(),
	time: z.coerce.number(),
	component: z.string(),
	baseAssetList: z.array(FuturesCompositeIndexAssetSchema),
});

export const FuturesAssetIndexSchema = z.object({
	symbol: z.string(),
	time: z.coerce.number(),
	index: z.coerce.number(),
	bidBuffer: z.coerce.number(),
	askBuffer: z.coerce.number(),
	bidRate: z.coerce.number(),
	askRate: z.coerce.number(),
	autoExchangeBidBuffer: z.coerce.number(),
	autoExchangeAskBuffer: z.coerce.number(),
	autoExchangeBidRate: z.coerce.number(),
	autoExchangeAskRate: z.coerce.number(),
});

export const FuturesIndexPriceConstituentItemSchema = z.object({
	exchange: z.string(),
	symbol: z.string(),
	price: z.coerce.number(),
	weight: z.coerce.number(),
});

export const FuturesIndexPriceConstituentsSchema = z.object({
	symbol: z.string(),
	time: z.coerce.number(),
	constituents: z.array(FuturesIndexPriceConstituentItemSchema),
});

export const FuturesInsuranceBalanceAssetSchema = z.object({
	asset: z.string(),
	marginBalance: z.coerce.number(),
	updateTime: z.coerce.number(),
});

export const FuturesInsuranceBalanceEntrySchema = z.object({
	symbols: z.array(z.string()),
	assets: z.array(FuturesInsuranceBalanceAssetSchema),
});

export const FuturesAccountBalanceSchema = z.array(
	z.object({
		accountAlias: z.string(),
		asset: z.string(),
		balance: z.coerce.number(),
		crossWalletBalance: z.coerce.number(),
		crossUnPnl: z.coerce.number(),
		availableBalance: z.coerce.number(),
		maxWithdrawAmount: z.coerce.number(),
		marginAvailable: z.boolean(),
		updateTime: z.number(),
	})
);

export const FuturesAccountAssetSchema = z.object({
	asset: z.string(),
	walletBalance: z.coerce.number(),
	unrealizedProfit: z.coerce.number(),
	marginBalance: z.coerce.number(),
	maintMargin: z.coerce.number(),
	initialMargin: z.coerce.number(),
	positionInitialMargin: z.coerce.number(),
	openOrderInitialMargin: z.coerce.number(),
	crossWalletBalance: z.coerce.number(),
	crossUnPnl: z.coerce.number(),
	availableBalance: z.coerce.number(),
	maxWithdrawAmount: z.coerce.number(),
	updateTime: z.number(),
	marginAvailable: z.boolean().optional(),
});

export const FuturesAccountPositionSchema = z.object({
	symbol: z.string(),
	positionSide: z.string(),
	positionAmt: z.coerce.number(),
	unrealizedProfit: z.coerce.number(),
	isolatedMargin: z.coerce.number(),
	notional: z.coerce.number(),
	isolatedWallet: z.coerce.number(),
	initialMargin: z.coerce.number(),
	maintMargin: z.coerce.number(),
	updateTime: z.number(),
});

export const FuturesAccountInfoSchema = z.object({
	totalInitialMargin: z.coerce.number(),
	totalMaintMargin: z.coerce.number(),
	totalWalletBalance: z.coerce.number(),
	totalUnrealizedProfit: z.coerce.number(),
	totalMarginBalance: z.coerce.number(),
	totalPositionInitialMargin: z.coerce.number(),
	totalOpenOrderInitialMargin: z.coerce.number(),
	totalCrossWalletBalance: z.coerce.number(),
	totalCrossUnPnl: z.coerce.number(),
	availableBalance: z.coerce.number(),
	maxWithdrawAmount: z.coerce.number(),
	assets: z.array(FuturesAccountAssetSchema),
	positions: z.array(FuturesAccountPositionSchema),
});

export const FuturesCommissionRateSchema = z.object({
	symbol: z.string(),
	makerCommissionRate: z.coerce.number(),
	takerCommissionRate: z.coerce.number(),
});

export const FuturesAccountConfigSchema = z.object({
	feeTier: z.number(),
	canTrade: z.boolean(),
	canDeposit: z.boolean(),
	canWithdraw: z.boolean(),
	dualSidePosition: z.boolean(),
	multiAssetsMargin: z.boolean(),
	tradeGroupId: z.number(),
});

export const FuturesSymbolConfigSchema = z.array(
	z.object({
		symbol: z.string(),
		marginType: z.enum(["ISOLATED", "CROSSED"]),
		isAutoAddMargin: z.boolean(),
		leverage: z.coerce.number(),
		maxNotionalValue: z.coerce
			.number()
			.or(z.literal("INF"))
			.transform((v) => (v === "INF" ? Infinity : Number(v))),
	})
);

export const FuturesUserRateLimitSchema = z.array(
	z.object({
		rateLimitType: z.literal("ORDERS"),
		interval: z.enum(["SECOND", "MINUTE", "DAY"]),
		intervalNum: z.number(),
		limit: z.number(),
	})
);

export const FuturesLeverageBracketEntrySchema = z.object({
	bracket: z.number(),
	initialLeverage: z.number(),
	notionalCap: z.number(),
	notionalFloor: z.number(),
	maintMarginRatio: z.number(),
	cum: z.number(),
});

export const FuturesLeverageBracketSchema = z.array(
	z.object({
		symbol: z.string(),
		notionalCoef: z.number().optional(),
		brackets: z.array(FuturesLeverageBracketEntrySchema),
	})
);

export const FuturesPositionModeSchema = z.object({
	dualSidePosition: z.boolean(),
});

export const FuturesIncomeTypeSchema = z.enum([
	"TRANSFER",
	"WELCOME_BONUS",
	"REALIZED_PNL",
	"FUNDING_FEE",
	"COMMISSION",
	"INSURANCE_CLEAR",
	"REFERRAL_KICKBACK",
	"COMMISSION_REBATE",
	"API_REBATE",
	"CONTEST_REWARD",
	"CROSS_COLLATERAL_TRANSFER",
	"OPTIONS_PREMIUM_FEE",
	"OPTIONS_SETTLE_PROFIT",
	"INTERNAL_TRANSFER",
	"AUTO_EXCHANGE",
	"DELIVERED_SETTELMENT",
	"COIN_SWAP_DEPOSIT",
	"COIN_SWAP_WITHDRAW",
	"POSITION_LIMIT_INCREASE_FEE",
	"STRATEGY_UMFUTURES_TRANSFER",
	"FEE_RETURN",
	"BFUSD_REWARD",
]);

export const FuturesIncomeHistorySchema = z.array(
	z.object({
		symbol: z.string().optional(),
		incomeType: FuturesIncomeTypeSchema,
		income: z.coerce.number(),
		asset: z.string(),
		info: z.string(),
		time: z.number(),
		tranId: z.number(),
		tradeId: z.string().optional(),
	})
);

export const FuturesOrderSideSchema = z.enum(["BUY", "SELL"]);
export const FuturesPositionSideSchema = z.enum(["BOTH", "LONG", "SHORT"]);

export const FuturesTimeInForceSchema = z.enum(["GTC", "IOC", "FOK", "GTX", "GTD"]);
export const FuturesWorkingTypeSchema = z.enum(["MARK_PRICE", "CONTRACT_PRICE"]);
export const FuturesNewOrderRespTypeSchema = z.enum(["ACK", "RESULT"]);
export const FuturesPriceMatchSchema = z.enum([
	"OPPONENT",
	"OPPONENT_5",
	"OPPONENT_10",
	"OPPONENT_20",
	"QUEUE",
	"QUEUE_5",
	"QUEUE_10",
	"QUEUE_20",
	"NONE",
]);
export const FuturesSelfTradePreventionSchema = z.enum(["NONE", "EXPIRE_TAKER", "EXPIRE_MAKER", "EXPIRE_BOTH"]);

export const FuturesNewOrderSchema = z.object({
	clientOrderId: z.string(),
	cumQty: z.coerce.number(),
	cumQuote: z.coerce.number(),
	executedQty: z.coerce.number(),
	orderId: z.number(),
	avgPrice: z.coerce.number(),
	origQty: z.coerce.number(),
	price: z.coerce.number(),
	reduceOnly: z.boolean(),
	side: FuturesOrderSideSchema,
	positionSide: FuturesPositionSideSchema,
	status: z.string(),
	stopPrice: z.coerce.number().optional(),
	closePosition: z.boolean().optional(),
	symbol: z.string(),
	timeInForce: FuturesTimeInForceSchema,
	type: FuturesOrderTypeSchema,
	origType: FuturesOrderTypeSchema,
	activatePrice: z.coerce.number().optional(),
	priceRate: z.coerce.number().optional(),
	updateTime: z.number(),
	workingType: FuturesWorkingTypeSchema,
	priceProtect: z.boolean(),
	priceMatch: FuturesPriceMatchSchema.optional(),
	selfTradePreventionMode: FuturesSelfTradePreventionSchema.optional(),
	goodTillDate: z.number().optional(),
});

export const FuturesGetListenKeySchema = z.object({
	listenKey: z.string(),
});
