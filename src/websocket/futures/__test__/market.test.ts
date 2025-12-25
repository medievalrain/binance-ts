import type { WebsocketClient } from "@/websocket/base/types";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { createFuturesWebsocketClient } from "../client";
import type { FuturesChannels } from "../types/channels";
import {
  futuresAggTradeEventSchema,
  futuresBookDepthEventSchema,
  futuresBookTickerEventSchema,
} from "./schema.gen";

let client: WebsocketClient<FuturesChannels>;

beforeAll(async () => {
  client = createFuturesWebsocketClient();
});

describe("Binance Futures WebSocket API - Market events", () => {
  describe("aggTrade - matchSchema", () => {
    it("matches schema", { timeout: 10000 }, async () => {
      await client.aggTrade.subscribe(["BTCUSDT"]);
      const fn = vi.fn();
      client.aggTrade.on((event) => {
        fn();

        expect(event).toEqual(expect.schemaMatching(futuresAggTradeEventSchema));
      });
      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
    });
  });

  describe("bookTicker - matchSchema", () => {
    it("matches schema", { timeout: 10000 }, async () => {
      await client.bookTicker.subscribe(["BTCUSDT"]);
      const fn = vi.fn();
      client.bookTicker.on((event) => {
        fn();
        expect(event).toEqual(expect.schemaMatching(futuresBookTickerEventSchema));
      });
      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
    });
  });

  describe("bookTicker - matchSchema", () => {
    it("matches schema", { timeout: 10000 }, async () => {
      await client.partialBookDepth.subscribe(["BTCUSDT"], { levels: 5 });
      const fn = vi.fn();
      client.partialBookDepth.on((event) => {
        fn();
        expect(event).toEqual(expect.schemaMatching(futuresBookDepthEventSchema));
      });
      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
    });
  });
});
