import { createWebsocketClient } from "../base/client";
import type { FuturesChannels } from "./types";

export const createFuturesWebsocketClient = (baseUrl: string = "wss://stream.binance.com:9443/ws") => {
	return createWebsocketClient<FuturesChannels>(baseUrl);
};
