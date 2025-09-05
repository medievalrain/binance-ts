import { z } from "zod";

export const SpotTestConnectivitySchema = z.object({});
export const SpotCheckServerTimeSchema = z.object({ serverTime: z.number() });
