import { FuturesRestClient } from "./futures/client";
import { SpotRestClient } from "./spot/client";

export class BinanceRestClient {
  private _futures?: FuturesRestClient;
  private _spot?: SpotRestClient;

  constructor(
    private options?: {
      apiKey?: string;
      apiSecret?: string;
      baseUrls?: { spot?: string; futures?: string };
    },
  ) {}

  get futures(): FuturesRestClient {
    if (!this._futures) {
      this._futures = new FuturesRestClient({
        apiKey: this.options?.apiKey,
        apiSecret: this.options?.apiSecret,
        baseUrl: this.options?.baseUrls?.futures,
      });
    }
    return this._futures;
  }

  get spot(): SpotRestClient {
    if (!this._spot) {
      this._spot = new SpotRestClient({
        baseUrl: this.options?.baseUrls?.spot,
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
