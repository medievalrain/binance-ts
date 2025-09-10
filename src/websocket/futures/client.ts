import { BinanceWebsocketClient } from "../base/client";
import type { FuturesMarketEvent } from "./types";

export class FuturesWebsocketClient extends BinanceWebsocketClient<FuturesMarketEvent> {
	constructor(baseUrl: string = "wss://stream.binance.com:9443/ws") {
		super(baseUrl);
	}
}
