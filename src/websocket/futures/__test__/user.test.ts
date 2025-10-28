import { beforeAll } from "vitest";

import { createFuturesUserWebsocketClient } from "../user";
import type { FuturesUserWebsocketClient } from "../types/user";

let client: FuturesUserWebsocketClient;

beforeAll(async () => {
	client = await createFuturesUserWebsocketClient({
		apiKey: process.env.API_KEY!,
		apiSecret: process.env.API_SECRET!,
	});
});
