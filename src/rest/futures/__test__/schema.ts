import { z } from "zod";

export const FuturesTestConnectivitySchema = z.object({});
export const FuturesCheckServerTimeSchema = z.object({ serverTime: z.number() });
