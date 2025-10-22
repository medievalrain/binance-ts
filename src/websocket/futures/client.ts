import { createWebsocketClient } from "../base";
import type { SymbolConverter } from "../base";
import type { FuturesChannels } from "./types";

const symbolConverter: SymbolConverter<FuturesChannels> = {
	bookTicker: (symbol: string) => {
		return `${symbol.toLowerCase()}@bookTicker`;
	},
	partialBookDepth: (symbol: string, { levels, updateSpeedMs }: { levels: number; updateSpeedMs?: number }) => {
		if (updateSpeedMs) {
			return `${symbol.toLowerCase()}@depth${levels}@${updateSpeedMs}ms`;
		}
		return `${symbol.toLowerCase()}@depth${levels}`;
	},
	aggTrade: (symbol: string) => {
		return `${symbol.toLowerCase()}@aggTrade`;
	},
};

export const createFuturesWebsocketClient = (baseUrl: string = "wss://stream.binance.com:9443/ws") => {
	return createWebsocketClient<FuturesChannels>(baseUrl, symbolConverter);
};
