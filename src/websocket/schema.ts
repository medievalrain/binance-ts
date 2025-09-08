import { z } from "zod";

export const ConnectionSuccessEventSchema = z.object({
	result: z.null(),
	id: z.number(),
});

export const FuturesConnectionErrorEventSchema = z.object({
	id: z.number(),
	status: z.number(),
	error: {
		code: z.number(),
		msg: z.string(),
	},
});

export const FuturesConnectionEventSchema = z.union([ConnectionSuccessEventSchema, FuturesConnectionErrorEventSchema]);

export const FuturesBookTickerEventSchema = z.object({
	e: z.literal("bookTicker"),
	u: z.number(),
	E: z.number(),
	T: z.number(),
	s: z.string(),
	b: z.coerce.number(),
	B: z.coerce.number(),
	a: z.coerce.number(),
	A: z.coerce.number(),
});

export const FuturesBookDepthEventSchema = z.object({
	e: z.literal("depthUpdate"),
	E: z.number(),
	T: z.number(),
	s: z.string(),
	U: z.number(),
	u: z.number(),
	pu: z.number(),
	b: z.array(z.tuple([z.coerce.number(), z.coerce.number()])),
	a: z.array(z.tuple([z.coerce.number(), z.coerce.number()])),
});

export const FuturesMarketEventSchema = z.discriminatedUnion("e", [FuturesBookTickerEventSchema, FuturesBookDepthEventSchema]);

export const FuturesWebsocketEventSchema = z.union([FuturesMarketEventSchema, FuturesConnectionEventSchema]);
