import type { CallbackOptions } from "@medievalrain/emitter";

export type ConnectionSuccessEvent = {
  result: null;
  id: number;
};

export type ConnectionErrorEvent = {
  result: null;
  id: number;
  status: number;
  error: {
    code: number;
    msg: string;
  };
};

export type ConnectionEvent = ConnectionSuccessEvent | ConnectionErrorEvent;

export type ChannelsMap = Record<string, { messageSchema: object; subscriptionOptions?: object }>;

export type SubscriptionState = "SUBSCRIBED" | "PENDING_SUBSCRIPTION" | "PENDING_UNSUBSCRIPTION";

export type OptArgs<
  CM extends ChannelsMap,
  K extends keyof CM,
> = CM[K]["subscriptionOptions"] extends never
  ? []
  : [options: CM[K]["subscriptionOptions"]];

export type WebsocketClient<CM extends ChannelsMap> = {
  [K in keyof CM]: {
    subscribe: (symbols: string[], ...args: OptArgs<CM, K>) => Promise<void>;
    unsubscribe: (symbols: string[], ...args: OptArgs<CM, K>) => Promise<void>;
    on: (cb: (data: CM[K]["messageSchema"]) => void, options?: CallbackOptions) => void;
    off: (cb: (data: CM[K]["messageSchema"]) => void) => void;
  };
};

export type WebsocketClientEventMap<MarketEvent extends object> = {
  marketMessage: (data: MarketEvent) => void;
  connectionMessage: (data: ConnectionEvent) => void;
  error: (error: Error | ConnectionErrorEvent) => void;
};

export type SymbolConverter<CM extends ChannelsMap> = {
  [K in keyof CM]: (symbol: string, ...args: OptArgs<CM, K>) => string;
};

export type Section<MarketEvent extends object> = {
  socket: WebSocket;
  subscriptions: Map<string, SubscriptionState>;
  connectionId: number;
  on: (callback: (data: MarketEvent) => void, options?: CallbackOptions) => void;
  off: (callback: (data: MarketEvent) => void) => void;
  subscribe: (symbols: string[]) => Promise<void>;
  unsubscribe: (symbols: string[]) => Promise<void>;
};
