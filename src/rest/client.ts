import type { ApiCredentials } from "@/types";
import { FuturesRestClient } from "./futures/client";

export class BinanceRestClient {
	public futures: FuturesRestClient;

	constructor(options?: { credentials?: ApiCredentials; baseUrls?: { spot?: string; futures?: string } }) {
		this.futures = new FuturesRestClient({
			credentials: options?.credentials,
			baseUrl: options?.baseUrls?.futures,
		});
	}
}
