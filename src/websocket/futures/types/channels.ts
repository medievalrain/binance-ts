import type { FuturesAggTradeEvent, FuturesBookDepthEvent, FuturesBookTickerEvent } from "./events";

export type FuturesChannels = {
  bookTicker: { messageSchema: FuturesBookTickerEvent; subscriptionOptions: never };
  partialBookDepth: {
    messageSchema: FuturesBookDepthEvent;
    subscriptionOptions: { levels: number; updateSpeedMs?: number };
  };
  aggTrade: { messageSchema: FuturesAggTradeEvent; subscriptionOptions: never };
};
