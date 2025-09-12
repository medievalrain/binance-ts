import { BaseRestClient } from "@/shared/base-rest-client";
import type { Client } from "undici";
import { SpotCheckServerTimeSchema, SpotTestConnectivitySchema } from "./schema";

export class SpotRestClient extends BaseRestClient {
	constructor({
		baseUrl = "https://api.binance.com",
		apiKey,
		apiSecret,
		httpOptions,
	}: {
		apiKey?: string;
		apiSecret?: string;
		baseUrl?: string;
		httpOptions?: Client.Options;
	}) {
		super({ baseUrl, apiKey, apiSecret, httpOptions });
	}

	public async testConnectivity() {
		return this.publicRequest({
			endpoint: "/api/v3/ping",
			schema: SpotTestConnectivitySchema,
		});
	}
	public async checkServerTime() {
		return this.publicRequest({
			endpoint: "/api/v3/time",
			schema: SpotCheckServerTimeSchema,
		});
	}
}
