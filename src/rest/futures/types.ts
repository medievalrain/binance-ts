export type FuturesTestConnectivity = {};
export type FuturesCheckServerTime = { serverTime: number };

export type FuturesExchangeInfoRateLimit = {
	interval: "MINUTE" | "SECOND";
	intervalNum: number;
	limit: number;
	rateLimitType: "REQUEST_WEIGHT" | "ORDERS";
};

export type FuturesExchangeInfoAsset = {
	asset: string;
	marginAvailable: boolean;
	autoAssetExchange: string | null;
};

export type FuturesExchangeInfoFilter =
	| {
			filterType: "PRICE_FILTER";
			maxPrice: number;
			minPrice: number;
			tickSize: number;
	  }
	| {
			filterType: "LOT_SIZE";
			maxQty: number;
			minQty: number;
			stepSize: number;
	  }
	| {
			filterType: "MARKET_LOT_SIZE";
			maxQty: number;
			minQty: number;
			stepSize: number;
	  }
	| {
			filterType: "MAX_NUM_ORDERS";
			limit: number;
	  }
	| {
			filterType: "MAX_NUM_ALGO_ORDERS";
			limit: number;
	  }
	| {
			filterType: "MIN_NOTIONAL";
			notional: string;
	  }
	| {
			filterType: "PERCENT_PRICE";
			multiplierUp: number;
			multiplierDown?: number;
			multiplierDecimal?: number;
	  }
	| {
			filterType: "POSITION_RISK_CONTROL";
			positionControlSide: "NONE";
			multiplierDown?: number;
			multiplierDecimal?: number;
	  };

export type FuturesContractType = "PERPETUAL" | "CURRENT_QUARTER" | "NEXT_QUARTER";
export type FuturesUnderlyingType = "COIN" | "INDEX" | "PREMARKET";

export type FuturesOrderType =
	| "LIMIT"
	| "MARKET"
	| "STOP"
	| "TAKE_PROFIT"
	| "STOP_MARKET"
	| "TAKE_PROFIT_MARKET"
	| "TRAILING_STOP_MARKET";

export type FuturesExchangeInfoSymbol = {
	symbol: string;
	pair: string;
	contractType: FuturesContractType;
	deliveryDate: number;
	onboardDate: number;
	status: "TRADING" | "SETTLING" | "PENDING_TRADING";
	maintMarginPercent: string;
	requiredMarginPercent: string;
	baseAsset: string;
	quoteAsset: string;
	marginAsset: string;
	pricePrecision: number;
	quantityPrecision: number;
	baseAssetPrecision: number;
	quotePrecision: number;
	underlyingType: FuturesUnderlyingType;
	underlyingSubType: string[];
	permissionSets: ("COPY" | "GRID")[];
	settlePlan?: number;
	triggerProtect: string;
	filters: FuturesExchangeInfoFilter[];
	OrderType?: FuturesOrderType[];
	timeInForce: string[];
	liquidationFee: number;
	marketTakeBound: number;
};

export type FuturesExchangeInfo = {
	exchangeFilters: unknown[];
	rateLimits: FuturesExchangeInfoRateLimit[];
	serverTime: number;
	assets: FuturesExchangeInfoAsset[];
	symbols: FuturesExchangeInfoSymbol[];
	timezone: string;
};

export type FuturesOrderBook = {
	lastUpdateId: number;
	E: number;
	T: number;
	bids: [number, number][];
	asks: [number, number][];
};

export type FuturesTrade = {
	id: number;
	price: number;
	qty: number;
	quoteQty: number;
	time: number;
	isBuyerMaker: boolean;
};

export type FuturesAggregateTrade = {
	a: number;
	p: number;
	q: number;
	f: number;
	l: number;
	T: number;
	m: boolean;
};

export type FuturesKlineInterval = "1s" | "1m" | "3m" | "5m" | "30m" | "1h" | "2h" | "6h" | "8h" | "12h" | "3d" | "1M";

export type FuturesKline = [number, number, number, number, number, number, number, number, number, number, number, number];

export type FuturesMarkPrice = {
	symbol: string;
	markPrice: number;
	indexPrice: number;
	estimatedSettlePrice: number;
	lastFundingRate: number;
	interestRate: number;
	nextFundingTime: number;
	time: number;
};

export type FuturesFundingRate = {
	symbol: string;
	fundingRate: number;
	fundingTime: number;
	markPrice: number;
};

export type FuturesFundingInfo = {
	symbol: string;
	adjustedFundingRateCap: number;
	adjustedFundingRateFloor: number;
	fundingIntervalHours: number;
};

export type FuturesTicker24h = {
	symbol: string;
	priceChange: number;
	priceChangePercent: number;
	weightedAvgPrice: number;
	lastPrice: number;
	lastQty: number;
	openPrice: number;
	highPrice: number;
	lowPrice: number;
	volume: number;
	quoteVolume: number;
	openTime: number;
	closeTime: number;
	firstId: number;
	lastId: number;
	count: number;
};

export type FuturesSymbolPrice = {
	symbol: string;
	price: number;
	time: number;
};

export type FuturesBookTicker = {
	symbol: string;
	bidPrice: number;
	bidQty: number;
	askPrice: number;
	askQty: number;
	time: number;
};

export type FuturesDeliveryPrice = {
	deliveryTime: number;
	deliveryPrice: number;
};

export type FuturesOpenInterest = {
	openInterest: number;
	symbol: string;
	time: number;
};

export type FuturesOpenInterestStats = {
	symbol: string;
	sumOpenInterest: number;
	sumOpenInterestValue: number;
	timestamp: number;
};

export type FuturesLongShortRatio = {
	symbol: string;
	longShortRatio: number;
	longAccount: number;
	shortAccount: number;
	timestamp: number;
};

export type FuturesOpenInterestPeriod = "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "12h" | "1d";

export type FuturesTakerBuySellRatio = {
	buySellRatio: number;
	buyVol: number;
	sellVol: number;
	timestamp: number;
};

export type FuturesBasis = {
	indexPrice: number;
	contractType: FuturesContractType;
	basisRate: number;
	futuresPrice: number;
	annualizedBasisRate?: string;
	basis: number;
	pair: string;
	timestamp: number;
};

export type FuturesCompositeIndexAsset = {
	baseAsset: string;
	quoteAsset: string;
	weightInQuantity: number;
	weightInPercentage: number;
};

export type FuturesCompositeIndex = {
	symbol: string;
	time: number;
	component: string;
	baseAssetList: FuturesCompositeIndexAsset[];
};

export type FuturesAssetIndex = {
	symbol: string;
	time: number;
	index: number;
	bidBuffer: number;
	askBuffer: number;
	bidRate: number;
	askRate: number;
	autoExchangeBidBuffer: number;
	autoExchangeAskBuffer: number;
	autoExchangeBidRate: number;
	autoExchangeAskRate: number;
};

export type FuturesIndexPriceConstituentItem = {
	exchange: string;
	symbol: string;
	price: number;
	weight: number;
};

export type FuturesIndexPriceConstituents = {
	symbol: string;
	time: number;
	constituents: FuturesIndexPriceConstituentItem[];
};

export type FuturesInsuranceBalanceAsset = {
	asset: string;
	marginBalance: number;
	updateTime: number;
};

export type FuturesInsuranceBalance = {
	symbols: string[];
	assets: FuturesInsuranceBalanceAsset[];
};

export type FuturesAccountBalance = {
	accountAlias: string;
	asset: string;
	balance: number;
	crossWalletBalance: number;
	crossUnPnl: number;
	availableBalance: number;
	maxWithdrawAmount: number;
	marginAvailable: boolean;
	updateTime: number;
};

export type FuturesAccountAsset = {
	asset: string;
	walletBalance: number;
	unrealizedProfit: number;
	marginBalance: number;
	maintMargin: number;
	initialMargin: number;
	positionInitialMargin: number;
	openOrderInitialMargin: number;
	crossWalletBalance: number;
	crossUnPnl: number;
	availableBalance: number;
	maxWithdrawAmount: number;
	updateTime: number;
	marginAvailable?: boolean;
};

export type FuturesAccountPosition = {
	symbol: string;
	positionSide: string;
	positionAmt: number;
	unrealizedProfit: number;
	isolatedMargin: number;
	notional: number;
	isolatedWallet: number;
	initialMargin: number;
	maintMargin: number;
	updateTime: number;
};

export type FuturesAccountInfo = {
	totalInitialMargin: number;
	totalMaintMargin: number;
	totalWalletBalance: number;
	totalUnrealizedProfit: number;
	totalMarginBalance: number;
	totalPositionInitialMargin: number;
	totalOpenOrderInitialMargin: number;
	totalCrossWalletBalance: number;
	totalCrossUnPnl: number;
	availableBalance: number;
	maxWithdrawAmount: number;
	assets: FuturesAccountAsset[];
	positions: FuturesAccountPosition[];
};

export type FuturesCommissionRate = {
	symbol: string;
	makerCommissionRate: string;
	takerCommissionRate: string;
};

export type FuturesAccountConfig = {
	feeTier: number;
	canTrade: boolean;
	canDeposit: boolean;
	canWithdraw: boolean;
	dualSidePosition: boolean;
	multiAssetsMargin: boolean;
	tradeGroupId: number;
};

export type FuturesSymbolConfig = {
	symbol: string;
	marginType: "ISOLATED" | "CROSSED";
	isAutoAddMargin: boolean;
	leverage: string;
	maxNotionalValue: string | "INF";
};

export type FuturesUserRateLimit = {
	rateLimitType: "ORDERS";
	interval: "SECOND" | "MINUTE" | "DAY";
	intervalNum: string;
	limit: string;
};

export type FuturesLeverageBracketEntry = {
	bracket: string;
	initialLeverage: string;
	notionalCap: string;
	notionalFloor: string;
	maintMarginRatio: string;
	cum: string;
};

export type FuturesLeverageBracket = {
	symbol: string;
	notionalCoef?: string;
	brackets: FuturesLeverageBracketEntry[];
};

export type FuturesPositionMode = {
	dualSidePosition: boolean;
};

export type FuturesIncomeType =
	| "TRANSFER"
	| "WELCOME_BONUS"
	| "REALIZED_PNL"
	| "FUNDING_FEE"
	| "COMMISSION"
	| "INSURANCE_CLEAR"
	| "REFERRAL_KICKBACK"
	| "COMMISSION_REBATE"
	| "API_REBATE"
	| "CONTEST_REWARD"
	| "CROSS_COLLATERAL_TRANSFER"
	| "OPTIONS_PREMIUM_FEE"
	| "OPTIONS_SETTLE_PROFIT"
	| "INTERNAL_TRANSFER"
	| "AUTO_EXCHANGE"
	| "DELIVERED_SETTELMENT"
	| "COIN_SWAP_DEPOSIT"
	| "COIN_SWAP_WITHDRAW"
	| "POSITION_LIMIT_INCREASE_FEE"
	| "STRATEGY_UMFUTURES_TRANSFER"
	| "FEE_RETURN"
	| "BFUSD_REWARD";

export type FuturesIncomeHistory = {
	symbol?: string;
	incomeType: FuturesIncomeType;
	income: string;
	asset: string;
	info: string;
	time: string;
	tranId: string;
	tradeId?: string;
};

export type FuturesOrderSide = "BUY" | "SELL";
export type FuturesPositionSide = "BOTH" | "LONG" | "SHORT";

export type FuturesTimeInForce = "GTC" | "IOC" | "FOK" | "GTX" | "GTD";
export type FuturesWorkingType = "MARK_PRICE" | "CONTRACT_PRICE";
export type FuturesNewOrderRespType = "ACK" | "RESULT";
export type FuturesPriceMatch =
	| "OPPONENT"
	| "OPPONENT_5"
	| "OPPONENT_10"
	| "OPPONENT_20"
	| "QUEUE"
	| "QUEUE_5"
	| "QUEUE_10"
	| "QUEUE_20"
	| "NONE";
export type FuturesSelfTradePrevention = "NONE" | "EXPIRE_TAKER" | "EXPIRE_MAKER" | "EXPIRE_BOTH";

export type FuturesNewOrder = {
	clientOrderId: string;
	cumQty: string;
	cumQuote: string;
	executedQty: string;
	orderId: string;
	avgPrice: string;
	origQty: string;
	price: string;
	reduceOnly: boolean;
	side: FuturesOrderSide;
	positionSide: FuturesPositionSide;
	status: string;
	stopPrice?: string;
	closePosition?: boolean;
	symbol: string;
	timeInForce: FuturesTimeInForce;
	type: FuturesOrderType;
	origType: FuturesOrderType;
	activatePrice?: string;
	priceRate?: string;
	updateTime: string;
	workingType: FuturesWorkingType;
	priceProtect: boolean;
	priceMatch?: FuturesPriceMatch;
	selfTradePreventionMode?: FuturesSelfTradePrevention;
	goodTillDate?: string;
};

export type FuturesGetListenKey = {
	listenKey: string;
};
