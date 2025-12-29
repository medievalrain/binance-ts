import { createHmac } from "node:crypto";
import { ApiError, MalformedParamError, WeightError } from "./api-error";

export type RawSearchParams = Record<
  string,
  string | undefined | null | string[] | number | boolean
>;

type ErrorResponse = {
  code: number;
  msg: string;
};

export class BaseRestClient {
  private apiKey?: string;
  private apiSecret?: string;
  private baseUrl: string;

  constructor({
    baseUrl,
    apiKey,
    apiSecret,
  }: {
    baseUrl: string;
    apiKey?: string;
    apiSecret?: string;
  }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;
  }

  protected marketRequest = async <T extends object>({
    endpoint,
    params,
  }: {
    endpoint: string;
    params?: RawSearchParams;
  }): Promise<NoInfer<T>> => {
    const searchParams = this.toSearchParams(params);
    const url = new URL(endpoint, this.baseUrl);
    url.search = searchParams.toString();
    const requestOptions: RequestInit = { keepalive: true };

    const response = await fetch(url.toString(), requestOptions);
    const json = await response.json();
    if (response.ok) {
      return json as T;
    }
    throw this.parseErrorResponse(endpoint, response.status, json);
  };

  protected async privateRequest<T extends object>({
    endpoint,
    params,
    method,
  }: {
    endpoint: string;
    params?: RawSearchParams;
    method: "GET" | "POST" | "DELETE" | "PUT";
  }): Promise<NoInfer<T>> {
    if (!this.apiKey || !this.apiSecret) {
      throw new ApiError({
        endpoint,
        metadata: { cause: "Empty credentials" },
      });
    }

    const searchParams = this.toSearchParams(params);
    searchParams.append("timestamp", new Date().getTime().toString());
    const signature = this.sign(searchParams.toString(), this.apiSecret);
    searchParams.append("signature", signature);
    const url = new URL(endpoint, this.baseUrl);

    const requestOptions: RequestInit = {
      keepalive: true,
      headers: { "X-MBX-APIKEY": this.apiKey },
      method,
    };
    if (method === "POST") {
      requestOptions.body = searchParams.toString();
    } else {
      url.search = searchParams.toString();
    }
    const response = await fetch(url.toString(), requestOptions);

    const json = await response.json();
    if (response.ok) {
      return json as T;
    }
    throw this.parseErrorResponse(endpoint, response.status, json);
  }

  private sign(message: string, secret: string) {
    return createHmac("sha256", secret).update(message).digest("hex");
  }

  private toSearchParams(rawParams?: RawSearchParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    if (!rawParams) {
      return searchParams;
    }

    for (const [key, value] of Object.entries(rawParams)) {
      if (Array.isArray(value)) {
        searchParams.append(key, JSON.stringify(value));
      } else if (value != null) {
        searchParams.append(key, String(value));
      }
    }
    return searchParams;
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
