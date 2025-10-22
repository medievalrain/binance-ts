import { z } from "zod";

export const ErrorResponseSchema = z.object({
	code: z.number(),
	msg: z.string(),
});
