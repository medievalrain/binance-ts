import { describe, it, beforeAll, expect } from "vitest";
import { SpotRestClient } from "../client";
import {
  spotCheckServerTimeSchema,
  spotExchangeInfoSchema,
  spotTestConnectivitySchema,
} from "./schema.gen";

let client: SpotRestClient;

beforeAll(async () => {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  client = new SpotRestClient({ apiKey, apiSecret });
  await client.testConnectivity();
});

describe("Binance Spot Public REST API", () => {
  describe("/api/v3/ping - Test Connectivity", () => {
    it("Should match schema", async () => {
      const response = await client.testConnectivity();
      expect(response).toEqual(expect.schemaMatching(spotTestConnectivitySchema.strict()));
    });
  });

  describe("/api/v3/time - Check Server Time", () => {
    it("Should match schema", async () => {
      const response = await client.checkServerTime();
      expect(response).toEqual(expect.schemaMatching(spotCheckServerTimeSchema.strict()));
    });
  });

  describe("/api/v3/exchangeInfo - Exchange Information", () => {
    it("Should match schema", async () => {
      const response = await client.exchangeInformation();
      expect(response).toEqual(expect.schemaMatching(spotExchangeInfoSchema.strict()));
    });
  });
}, 10000);
