import type { ApiCredentials } from "@/shared/types";
import { FuturesRestClient } from "./futures/client";
import { SpotRestClient } from "./spot/client";

interface RestClientOptions extends ApiCredentials {
	baseUrls?: { spot?: string; futures?: string };
}

class BinanceRestClient {
	private _futures?: FuturesRestClient;
	private _spot?: SpotRestClient;

	constructor(private options?: RestClientOptions) {}

	get futures(): FuturesRestClient {
		if (!this._futures) {
			this._futures = new FuturesRestClient({
				apiKey: this.options?.apiKey,
				apiSecret: this.options?.apiSecret,
				baseUrl: this.options?.baseUrls?.futures,
			});
		}
		return this._futures;
	}

	get spot(): SpotRestClient {
		if (!this._spot) {
			this._spot = new SpotRestClient({
				baseUrl: this.options?.baseUrls?.spot,
			});
		}
		return this._spot;
	}
}
export const createBinanceRestClient = (options?: RestClientOptions) => {
	return new BinanceRestClient(options);
};
