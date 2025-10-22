import { ApiError, MalformedParamError, WeightError } from "./api-error";

export type RawSearchParams = Record<string, string | undefined | null | string[] | number | boolean>;

type ErrorResponse = {
	code: number;
	msg: string;
};

export class BaseRestClient {
	private apiKey?: string;
	private apiSecret?: string;
	private baseUrl: string;

	constructor({ baseUrl, apiKey, apiSecret }: { baseUrl: string; apiKey?: string; apiSecret?: string }) {
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
		this.baseUrl = baseUrl;
	}

	protected marketRequest = async <T extends object>({
		endpoint,
		params,
		withApiKey,
	}: {
		endpoint: string;
		params?: RawSearchParams;
		withApiKey?: boolean;
	}): Promise<T> => {
		const searchParams = this.toSearchParams(params);
		const url = new URL(endpoint, this.baseUrl);
		if (searchParams) {
			url.search = searchParams;
		}
		const requestOptions: RequestInit = { keepalive: true };
		if (withApiKey) {
			if (!this.apiKey) {
				throw new ApiError({
					endpoint,
					metadata: { cause: "Empty credentials" },
				});
			}
			requestOptions.headers = {
				"X-MBX-APIKEY": this.apiKey,
			};
		}

		const response = await fetch(url.toString(), requestOptions);
		const json = await response.json();
		if (response.status === 200) {
			return json as T;
		}
		throw this.parseErrorResponse(endpoint, response.status, json);
	};

	private toSearchParams(rawParams?: RawSearchParams): string {
		if (!rawParams) {
			return "";
		}
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(rawParams)) {
			if (Array.isArray(value)) {
				searchParams.append(key, JSON.stringify(value));
			}
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		}
		return searchParams.toString();
	}

	private parseErrorResponse(endpoint: string, statusCode: number, json: ErrorResponse): void {
		if (!json.code || !json.msg) {
			throw new ApiError({ endpoint, metadata: { json } });
		}

		switch (statusCode) {
			case 418: {
				throw new WeightError({ message: json.msg, endpoint });
			}

			case 400: {
				throw new MalformedParamError({ endpoint, message: json.msg });
			}

			default: {
				throw new ApiError({ endpoint, metadata: { json } });
			}
		}
	}
}
