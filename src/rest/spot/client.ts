import { BaseRestClient } from "@/rest/base/base-rest-client";

import type { SpotCheckServerTime, SpotTestConnectivity } from "./types";

export class SpotRestClient extends BaseRestClient {
	constructor({
		baseUrl = "https://api.binance.com",
		apiKey,
		apiSecret,
	}: {
		apiKey?: string;
		apiSecret?: string;
		baseUrl?: string;
	}) {
		super({ baseUrl, apiKey, apiSecret });
	}

	public async testConnectivity(): Promise<SpotTestConnectivity> {
		return this.marketRequest<SpotTestConnectivity>({
			endpoint: "/api/v3/ping",
		});
	}
	public async checkServerTime(): Promise<SpotCheckServerTime> {
		return this.marketRequest<SpotCheckServerTime>({
			endpoint: "/api/v3/time",
		});
	}
}
