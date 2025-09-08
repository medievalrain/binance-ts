import type { z } from "zod";
import type { FuturesMarketEventSchema, FuturesConnectionEventSchema, FuturesConnectionErrorEventSchema } from "./schema";

export type FuturesMarketEvent = z.infer<typeof FuturesMarketEventSchema>;

export type FuturesConnectionEvent = z.infer<typeof FuturesConnectionEventSchema>;
export type FuturesConnectionErrorEvent = z.infer<typeof FuturesConnectionErrorEventSchema>;
