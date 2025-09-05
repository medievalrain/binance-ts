import { Client, Dispatcher } from "undici";

import { ApiError, MalformedParamError, ValidationError, WeightError } from "./api-error";
import type { ApiCredentials } from "@/types";
import * as z4 from "zod/v4/core";
import { ErrorResponseSchema } from "./schema";
import { createHmac } from "node:crypto";

export type RawSearchParams = Record<string, string | undefined | null | string[] | number | boolean>;

export class BaseRestClient {
	private credentials?: ApiCredentials;
	private httpCleint: Client;

	constructor({
		baseUrl,
		credentials,
		httpOptions,
	}: {
		baseUrl: string;
		credentials?: ApiCredentials;
		httpOptions?: Client.Options;
	}) {
		this.credentials = credentials;
		this.httpCleint = new Client(baseUrl, {
			allowH2: true,
			...httpOptions,
		});
	}

	private toSearchParams(rawParams?: RawSearchParams) {
		if (!rawParams) {
			return {};
		}

		return Object.entries(rawParams).reduce<Record<string, string>>((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc[key] = JSON.stringify(value);
				return acc;
			}
			if (value !== undefined && value !== null) {
				acc[key] = String(value);
			}
			return acc;
		}, {});
	}

	private parseErrorResponse(endpoint: string, statusCode: number, json: unknown) {
		const result = ErrorResponseSchema.safeParse(json);
		if (result.error) {
			throw new ApiError({ endpoint, metadata: { error: result.error, json } });
		}

		switch (statusCode) {
			case 418: {
				throw new WeightError({ message: result.data.msg, endpoint });
			}

			case 400: {
				throw new MalformedParamError({ endpoint, message: result.data.msg });
			}

			default: {
				throw new ApiError({ endpoint, metadata: { json } });
			}
		}
	}

	private async parseResponse<T extends z4.$ZodType>(schema: T, response: Dispatcher.ResponseData, endpoint: string) {
		const json = await response.body.json();

		if (response.statusCode === 200) {
			const result = z4.safeParse(schema, json);
			if (result.error) {
				throw new ValidationError({
					endpoint,
					input: json,
					error: result.error,
				});
			}

			return result.data;
		}
		throw this.parseErrorResponse(endpoint, response.statusCode, json);
	}

	protected async publicRequest<T extends z4.$ZodType>({
		endpoint,
		params,
		schema,
	}: {
		endpoint: string;
		params?: RawSearchParams;
		schema: T;
	}) {
		const searchParams = this.toSearchParams(params);

		const response = await this.httpCleint.request({
			method: "GET",
			path: endpoint,
			query: searchParams,
			headers: {
				"X-MBX-APIKEY": this.credentials?.secret,
			},
		});
		return this.parseResponse(schema, response, endpoint);
	}

	protected async privateRequest<T extends z4.$ZodType>({
		endpoint,
		params,
		schema,
		method,
	}: {
		endpoint: string;
		params?: RawSearchParams;
		method: "GET" | "POST" | "DELETE";
		schema: T;
	}) {
		if (!this.credentials) {
			throw new ApiError({
				endpoint,
				metadata: { cause: "Empty credentials" },
			});
		}

		const searchParams = this.toSearchParams(params);
		if (this.credentials) {
			searchParams["timestamp"] = new Date().getTime().toString();
			const signature = this.sign(new URLSearchParams(searchParams).toString(), this.credentials.secret);
			searchParams["signature"] = signature;
		}

		const response = await this.httpCleint.request({
			method,
			path: endpoint,
			query: method !== "POST" ? searchParams : undefined,
			body: method === "POST" ? new URLSearchParams(searchParams).toString() : undefined,
			headers: {
				"X-MBX-APIKEY": this.credentials?.key,
			},
		});

		return this.parseResponse(schema, response, endpoint);
	}

	private sign(message: string, secret: string) {
		return createHmac("sha256", secret).update(message).digest("hex");
	}
}
