export type SpotTestConnectivity = {};
export type SpotCheckServerTime = { serverTime: number };

export type SpotExchangeInfoRateLimit =
  | { rateLimitType: "REQUEST_WEIGHT"; interval: "MINUTE"; intervalNum: number; limit: number }
  | { rateLimitType: "ORDERS"; interval: "SECOND"; intervalNum: number; limit: number }
  | { rateLimitType: "ORDERS"; interval: "DAY"; intervalNum: number; limit: number }
  | { rateLimitType: "RAW_REQUESTS"; interval: "MINUTE"; intervalNum: number; limit: number };

export type SpotOrderType =
  | "LIMIT"
  | "LIMIT_MAKER"
  | "MARKET"
  | "STOP_LOSS"
  | "STOP_LOSS_LIMIT"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_LIMIT";

export type SpotSelfTradePreventionMode =
  | "EXPIRE_TAKER"
  | "EXPIRE_MAKER"
  | "EXPIRE_BOTH"
  | "DECREMENT";

export type SpotExchangeInfoFilter =
  | {
      filterType: "PRICE_FILTER";
      minPrice: string;
      maxPrice: string;
      tickSize: string;
    }
  | {
      filterType: "LOT_SIZE";
      minQty: string;
      maxQty: string;
      stepSize: string;
    }
  | { filterType: "ICEBERG_PARTS"; limit: number }
  | {
      filterType: "MARKET_LOT_SIZE";
      minQty: string;
      maxQty: string;
      stepSize: string;
    }
  | {
      filterType: "TRAILING_DELTA";
      minTrailingAboveDelta: number;
      maxTrailingAboveDelta: number;
      minTrailingBelowDelta: number;
      maxTrailingBelowDelta: number;
    }
  | {
      filterType: "PERCENT_PRICE_BY_SIDE";
      bidMultiplierUp: string;
      bidMultiplierDown: string;
      askMultiplierUp: string;
      askMultiplierDown: string;
      avgPriceMins: number;
    }
  | {
      filterType: "NOTIONAL";
      minNotional: string;
      applyMinToMarket: boolean;
      maxNotional: string;
      applyMaxToMarket: boolean;
      avgPriceMins: number;
    }
  | { filterType: "MAX_NUM_ORDERS"; maxNumOrders: number }
  | { filterType: "MAX_NUM_ORDER_LISTS"; maxNumOrderLists: number }
  | { filterType: "MAX_NUM_ALGO_ORDERS"; maxNumAlgoOrders: number }
  | { filterType: "MAX_NUM_ORDER_AMENDS"; maxNumOrderAmends: number }
  | { filterType: "MAX_POSITION"; maxPosition: string };

export type SpotExchangeInfoSymbolTradingStatus = "TRADING" | "BREAK";

export type SpotExchangeInfoSymbol = {
  symbol: string;
  status: SpotExchangeInfoSymbolTradingStatus;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: SpotOrderType[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  otoAllowed: boolean;
  opoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  amendAllowed: boolean;
  pegInstructionsAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: SpotExchangeInfoFilter[];
  permissions: unknown[];
  permissionSets: [string[]];
  defaultSelfTradePreventionMode: SpotSelfTradePreventionMode;
  allowedSelfTradePreventionModes: SpotSelfTradePreventionMode[];
};

export type SpotExchangeInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: SpotExchangeInfoRateLimit[];
  exchangeFilters: unknown[];
  symbols: SpotExchangeInfoSymbol[];
};
