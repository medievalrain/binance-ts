import type { WebsocketClient } from "@/websocket/base/types";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { createFuturesWebsocketClient } from "../client";
import type { FuturesChannels } from "../types/channels";
import { futuresAggTradeEventSchema } from "./schema.gen";

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
});
