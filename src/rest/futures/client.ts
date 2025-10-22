import { BaseRestClient } from "@/shared/base-rest-client";
import type { FuturesCheckServerTime, FuturesTestConnectivity } from "./types";

export class FuturesRestClient extends BaseRestClient {
	constructor({
		baseUrl = "https://fapi.binance.com",
		apiKey,
		apiSecret,
	}: {
		apiKey?: string;
		apiSecret?: string;
		baseUrl?: string;
	}) {
		super({ baseUrl, apiKey, apiSecret });
	}

	public async testConnectivity(): Promise<FuturesTestConnectivity> {
		return this.marketRequest<FuturesCheckServerTime>({
			endpoint: "/fapi/v1/ping",
		});
	}
	public async checkServerTime(): Promise<FuturesCheckServerTime> {
		return this.marketRequest<FuturesCheckServerTime>({
			endpoint: "/fapi/v1/time",
		});
	}
}
