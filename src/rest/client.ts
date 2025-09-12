import { FuturesRestClient } from "./futures/client";
import { SpotRestClient } from "./spot/client";

export class BinanceRestClient {
	public futures: FuturesRestClient;
	public spot: SpotRestClient;

	constructor(options?: { apiKey?: string; apiSecret?: string; baseUrls?: { spot?: string; futures?: string } }) {
		this.futures = new FuturesRestClient({
			apiKey: options?.apiKey,
			apiSecret: options?.apiSecret,
			baseUrl: options?.baseUrls?.futures,
		});
		this.spot = new SpotRestClient({ baseUrl: options?.baseUrls?.spot });
	}
}
