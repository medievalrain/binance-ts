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
			minPrice: string;
			tickSize: string;
			maxPrice: string;
	  }
	| {
			filterType: "LOT_SIZE";
			minQty: string;
			stepSize: string;
			maxQty: string;
	  }
	| {
			filterType: "MARKET_LOT_SIZE";
			maxQty: string;
			minQty: string;
			stepSize: string;
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
			multiplierUp: string;
			multiplierDown: string;
			multiplierDecimal: string;
	  }
	| {
			filterType: "POSITION_RISK_CONTROL";
			positionControlSide: "NONE";
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

export type PermissionSet = "COPY" | "GRID" | "DCA";

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
	permissionSets: PermissionSet[];
	settlePlan?: number;
	triggerProtect: string;
	filters: FuturesExchangeInfoFilter[];
	OrderType?: FuturesOrderType[];
	timeInForce: string[];
	liquidationFee: string;
	marketTakeBound: string;
};

export type FuturesExchangeInfo = {
	exchangeFilters: unknown[];
	futuresType: "U_MARGINED"; // @TODO Add other options later
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
	bids: [string, string][];
	asks: [string, string][];
};

export type FuturesTrade = {
	id: number;
	price: string;
	qty: string;
	quoteQty: string;
	time: number;
	isBuyerMaker: boolean;
	isRPITrade: boolean;
};

export type FuturesAggregateTrade = {
	a: number;
	p: string;
	q: string;
	f: number;
	l: number;
	T: number;
	m: boolean;
};

export type FuturesKlineInterval = "1s" | "1m" | "3m" | "5m" | "30m" | "1h" | "2h" | "6h" | "8h" | "12h" | "3d" | "1M";

export type FuturesKline = [number, string, string, string, string, string, number, string, number, string, string, string];

export type FuturesMarkPrice = {
	symbol: string;
	markPrice: string;
	indexPrice: string;
	estimatedSettlePrice: string;
	lastFundingRate: string;
	interestRate: string;
	nextFundingTime: number;
	time: number;
};

export type FuturesFundingRate = {
	symbol: string;
	fundingRate: string;
	fundingTime: number;
	markPrice: string;
};

export type FuturesFundingInfo = {
	adjustedFundingRateCap: string;
	adjustedFundingRateFloor: string;
	disclaimer: boolean;
	fundingIntervalHours: number;
	symbol: string;
	updateTime: number | null;
};

export type FuturesTicker24h = {
	closeTime: number;
	count: number;
	firstId: number;
	highPrice: string;
	lastId: number;
	lastPrice: string;
	lastQty: string;
	lowPrice: string;
	openPrice: string;
	openTime: number;
	priceChange: string;
	priceChangePercent: string;
	quoteVolume: string;
	symbol: string;
	volume: string;
	weightedAvgPrice: string;
};

export type FuturesSymbolPrice = {
	symbol: string;
	price: string;
	time: number;
};

export type FuturesBookTicker = {
	symbol: string;
	bidPrice: string;
	bidQty: string;
	askPrice: string;
	askQty: string;
	time: number;
	lastUpdateId: number;
};

export type FuturesDeliveryPrice = {
	deliveryTime: number;
	deliveryPrice: number;
};

export type FuturesOpenInterest = {
	openInterest: string;
	symbol: string;
	time: number;
};

export type FuturesOpenInterestStats = {
	symbol: string;
	CMCCirculatingSupply: string;
	sumOpenInterest: string;
	sumOpenInterestValue: string;
	timestamp: number;
};

export type FuturesLongShortRatio = {
	symbol: string;
	longShortRatio: string;
	longAccount: string;
	shortAccount: string;
	timestamp: number;
};

export type FuturesOpenInterestPeriod = "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "12h" | "1d";

export type FuturesTakerBuySellRatio = {
	buySellRatio: string;
	buyVol: string;
	sellVol: string;
	timestamp: number;
};

export type FuturesBasis = {
	indexPrice: string;
	contractType: FuturesContractType;
	basisRate: string;
	futuresPrice: string;
	annualizedBasisRate: string;
	basis: string;
	pair: string;
	timestamp: number;
};

export type FuturesCompositeIndexAsset = {
	baseAsset: string;
	quoteAsset: string;
	weightInQuantity: string;
	weightInPercentage: string;
};

export type FuturesCompositeIndex = {
	symbol: string;
	time: number;
	component: string;
	baseAssetList: FuturesCompositeIndexAsset[];
};

export type FuturesAssetIndex = {
	askBuffer: string;
	askRate: string;
	autoExchangeAskBuffer: string;
	autoExchangeAskRate: string;
	autoExchangeBidBuffer: string;
	autoExchangeBidRate: string;
	bidBuffer: string;
	bidRate: string;
	index: string;
	symbol: string;
	time: number;
};

export type FuturesIndexPriceConstituentItem = {
	exchange: string;
	symbol: string;
	price: string;
	weight: string;
};

export type FuturesIndexPriceConstituents = {
	symbol: string;
	time: number;
	constituents: FuturesIndexPriceConstituentItem[];
};

export type FuturesInsuranceBalanceAsset = {
	asset: string;
	marginBalance: string;
	updateTime: number;
};

export type FuturesInsuranceBalance = {
	symbols: string[];
	assets: FuturesInsuranceBalanceAsset[];
};

export type FuturesAccountBalance = {
	accountAlias: string;
	asset: string;
	balance: string;
	crossWalletBalance: string;
	crossUnPnl: string;
	availableBalance: string;
	maxWithdrawAmount: string;
	marginAvailable: boolean;
	updateTime: number;
};

export type FuturesAccountAsset = {
	asset: string;
	walletBalance: string;
	unrealizedProfit: string;
	marginBalance: string;
	maintMargin: string;
	initialMargin: string;
	positionInitialMargin: string;
	openOrderInitialMargin: string;
	crossWalletBalance: string;
	crossUnPnl: string;
	availableBalance: string;
	maxWithdrawAmount: string;
	updateTime: number;
	marginAvailable?: boolean;
};

export type FuturesAccountPosition = {
	symbol: string;
	positionSide: string;
	positionAmt: string;
	unrealizedProfit: string;
	isolatedMargin: string;
	notional: string;
	isolatedWallet: string;
	initialMargin: string;
	maintMargin: string;
	updateTime: number;
};

export type FuturesAccountInfo = {
	totalInitialMargin: string;
	totalMaintMargin: string;
	totalWalletBalance: string;
	totalUnrealizedProfit: string;
	totalMarginBalance: string;
	totalPositionInitialMargin: string;
	totalOpenOrderInitialMargin: string;
	totalCrossWalletBalance: string;
	totalCrossUnPnl: string;
	availableBalance: string;
	maxWithdrawAmount: string;
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
	updateTime: number;
};

export type FuturesSymbolConfig = {
	symbol: string;
	marginType: "ISOLATED" | "CROSSED";
	isAutoAddMargin: boolean;
	leverage: number;
	maxNotionalValue: string | "INF";
};

export type FuturesUserRateLimit = {
	rateLimitType: "ORDERS";
	interval: "SECOND" | "MINUTE" | "DAY";
	intervalNum: number;
	limit: number;
};

export type FuturesLeverageBracketEntry = {
	bracket: number;
	initialLeverage: number;
	notionalCap: number;
	notionalFloor: number;
	maintMarginRatio: number;
	cum: number;
};

export type FuturesLeverageBracket = {
	symbol: string;
	notionalCoef?: number;
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
	time: number;
	tranId: number;
	tradeId: string;
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
