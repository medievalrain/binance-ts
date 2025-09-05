import type { ApiCredentials } from "@/types";
import { FuturesRestClient } from "./futures/client";
import { SpotRestClient } from "./spot/client";

export class BinanceRestClient {
	public futures: FuturesRestClient;
	public spot: SpotRestClient;

	constructor(options?: { credentials?: ApiCredentials; baseUrls?: { spot?: string; futures?: string } }) {
		this.futures = new FuturesRestClient({
			credentials: options?.credentials,
			baseUrl: options?.baseUrls?.futures,
		});
		this.spot = new SpotRestClient({ credentials: options?.credentials, baseUrl: options?.baseUrls?.spot });
	}
}
