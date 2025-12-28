import type { CallbackOptions } from "@medievalrain/emitter";

export type BaseFuturesEvent = {
  e: string;
  E: number;
};

export type FuturesListenKeyExpiredEvent = {
  e: "listenKeyExpired";
  E: number;
  listenKey: string;
};

export type FuturesAccountUpdateEventReason =
  | "DEPOSIT"
  | "WITHDRAW"
  | "ORDER"
  | "FUNDING_FEE"
  | "WITHDRAW_REJECT"
  | "ADJUSTMENT"
  | "INSURANCE_CLEAR"
  | "ADMIN_DEPOSIT"
  | "ADMIN_WITHDRAW"
  | "MARGIN_TRANSFER"
  | "MARGIN_TYPE_CHANGE"
  | "ASSET_TRANSFER"
  | "OPTIONS_PREMIUM_FEE"
  | "OPTIONS_SETTLE_PROFIT"
  | "AUTO_EXCHANGE"
  | "COIN_SWAP_DEPOSIT"
  | "COIN_SWAP_WITHDRAW";

export type FuturesAccountUpdateEventBalance = {
  a: string;
  wb: string;
  cw: string;
  bc: string;
};

export type FuturesPositionSide = "LONG" | "SHORT";

export type FuturesAccountUpdateEventPosition = {
  s: string;
  pa: string;
  ep: string;
  bep: string;
  cr: string;
  up: string;
  mt: "isolated" | (string & {});
  iw: string;
  ps: FuturesPositionSide;
};

export type FuturesAccountUpdateEvent = {
  e: "ACCOUNT_UPDATE";
  E: number;
  T: number;
  a: {
    m: FuturesAccountUpdateEventReason;
    B: FuturesAccountUpdateEventBalance[];
    P: FuturesAccountUpdateEventPosition[];
  };
};

export type FuturesMarginCallPosition = {
  s: string;
  ps: FuturesPositionSide;
  pa: string;
  mt: "CROSSED" | "ISOLATED";
  iw: string;
  mp: string;
  up: string;
  mm: string;
};

export type FuturesMarginCallEvent = {
  e: "MARGIN_CALL";
  E: number;
  cw: string;
  p: FuturesMarginCallPosition[];
};

export type FuturesOrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP"
  | "STOP_MARKET"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_MARKET"
  | "TRAILING_STOP_MARKET"
  | "LIQUIDATION";

export type FuturesOrderTimeInForce = "GTC" | "IOC" | "FOK" | "GTX";

export type FuturesOrderExecutionType =
  | "NEW"
  | "CANCELED"
  | "CALCULATED"
  | "EXPIRED"
  | "TRADE"
  | "AMENDMENT";

export type FuturesOrderStatus =
  | "NEW"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELED"
  | "EXPIRED"
  | "EXPIRED_IN_MATCH";

export type FuturesOrderSide = "BUY" | "SELL";

export type FuturesOrderWorkingType = "CONTRACT_PRICE" | "MARK_PRICE";

export type FuturesOrderUpdateEvent = {
  e: "ORDER_TRADE_UPDATE";
  E: number;
  T: number;
  o: {
    s: string;
    c: string;
    S: FuturesOrderSide;
    o: FuturesOrderType;
    f: FuturesOrderTimeInForce;
    q: string;
    p: string;
    ap: string;
    sp: string;
    x: FuturesOrderExecutionType;
    X: FuturesOrderStatus;

    i: number;
    l: string;
    z: string;
    L: string;
    N: string;
    n: string;
    T: number;
    t: number;
    b: string;
    a: string;
    m: boolean;
    R: boolean;
    wt: FuturesOrderWorkingType;
    ot: "TRAILING_STOP_MARKET";
    ps: FuturesPositionSide;
    cp: boolean;
    AP: string;
    cr: string;
    pP: boolean;
    si: number;
    ss: number;
    rp: string;
    V: "EXPIRE_TAKER";
    pm: "OPPONENT";
    gtd: number;
    er: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  };
};

export type FuturesTradeLiteEvent = {
  e: "TRADE_LITE";
  E: number;
  T: number;
  s: string;
  q: string;
  p: string;
  m: boolean;
  c: string;
  S: FuturesPositionSide;
  L: string;
  l: string;
  t: number;
  i: number;
};

export type AccountConfigUpdateEvent = {
  e: "ACCOUNT_CONFIG_UPDATE";
  E: number;
  T: number;
} & (
  | {
      ac: {
        s: string;
        l: number;
      };
    }
  | {
      ai: {
        j: boolean;
      };
    }
);

export type FuturesStrategyStatus = "NEW" | "WORKING" | "CANCELLED" | "EXPIRED";

export type FuturesStrategyUpdateEvent = {
  e: "STRATEGY_UPDATE";
  T: number;
  E: number;
  su: {
    si: number;
    st: "GRID";
    ss: FuturesStrategyStatus;
    s: string;
    ut: number;
    c:
      | 8001
      | 8002
      | 8003
      | 8004
      | 8005
      | 8006
      | 8007
      | 8008
      | 8009
      | 8010
      | 8011
      | 8012
      | 8013
      | 8014
      | 8015;
  };
};

export type FuturesGridUpdateEvent = {
  e: "GRID_UPDATE";
  T: number;
  E: number;
  gu: {
    si: number;
    st: "GRID";
    ss: FuturesStrategyStatus;
    s: string;
    r: string;
    up: string;
    uq: string;
    uf: string;
    mp: string;
    ut: number;
  };
};

export type FuturesConditionalOrderTriggerRejectEvent = {
  e: "CONDITIONAL_ORDER_TRIGGER_REJECT";
  T: number;
  E: number;
  or: {
    s: string;
    i: number;
    r: string;
  };
};
export type FuturesUserEvent =
  | FuturesListenKeyExpiredEvent
  | FuturesAccountUpdateEvent
  | FuturesMarginCallEvent
  | FuturesOrderUpdateEvent
  | FuturesTradeLiteEvent
  | AccountConfigUpdateEvent
  | FuturesStrategyUpdateEvent
  | FuturesGridUpdateEvent
  | FuturesConditionalOrderTriggerRejectEvent;

export const futuresEventRouting = {
  listenKeyExpired: "listenKeyExpired",
  accountUpdate: "ACCOUNT_UPDATE",
  marginCall: "MARGIN_CALL",
  orderTradeUpdate: "ORDER_TRADE_UPDATE",
  tradeLite: "TRADE_LITE",
  accountConfigUpdate: "ACCOUNT_CONFIG_UPDATE",
  strategyUpdate: "STRATEGY_UPDATE",
  gridUpdate: "GRID_UPDATE",
  conditionalOrderTriggerReject: "CONDITIONAL_ORDER_TRIGGER_REJECT",
} as const;

export type UserEventMap = {
  [MethodName in keyof typeof futuresEventRouting]: (
    data: InferFutruresUserEvent<(typeof futuresEventRouting)[MethodName]>,
  ) => void;
};

export type InferFutruresUserEvent<EventName extends FuturesUserEvent["e"]> = Extract<
  FuturesUserEvent,
  { e: EventName }
>;

export type FuturesUserWebsocketClient = {
  [MethodName in keyof typeof futuresEventRouting]: {
    on: (
      callback: (
        data: InferFutruresUserEvent<(typeof futuresEventRouting)[MethodName]>,
        options?: CallbackOptions,
      ) => void,
    ) => void;
    off: (
      callback: (
        data: InferFutruresUserEvent<(typeof futuresEventRouting)[MethodName]>,
        options?: CallbackOptions,
      ) => void,
      options?: CallbackOptions,
    ) => void;
  };
};
