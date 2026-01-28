import { FuturesRestClient } from "./futures/client";
import { SpotRestClient } from "./spot/client";

export class BinanceRestClient {
  private _futures?: FuturesRestClient;
  private _spot?: SpotRestClient;

  private apiKey?: string;
  private apiSecret?: string;
  private baseUrls?: { spot?: string; futures?: string };

  constructor(options?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrls?: { spot?: string; futures?: string };
  }) {
    this.apiKey = options?.apiKey;
    this.apiSecret = options?.apiSecret;
    this.baseUrls = options?.baseUrls;
  }

  get futures(): FuturesRestClient {
    if (!this._futures) {
      this._futures = new FuturesRestClient({
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        baseUrl: this.baseUrls?.futures,
      });
    }
    return this._futures;
  }

  get spot(): SpotRestClient {
    if (!this._spot) {
      this._spot = new SpotRestClient({
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        baseUrl: this.baseUrls?.spot,
      });
    }
    return this._spot;
  }
}
export const createBinanceRestClient = (options?: {
  apiKey?: string;
  apiSecret?: string;
  baseUrls?: { spot?: string; futures?: string };
}): BinanceRestClient => {
  return new BinanceRestClient(options);
};
