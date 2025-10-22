export type FuturesBookTickerEvent = {
	u: number;
	s: string;
	b: string;
	B: string;
	a: string;
	A: string;
};

export type FuturesBookDepthEvent = {
	E: number;
	T: number;
	s: string;
	U: number;
	u: number;
	pu: number;
	b: [string, string][];
	a: [string, string][];
};

export type FuturesAggTradeEvent = {
	e: "aggTrade";
	E: number;
	s: string;
	a: number;
	p: string;
	q: string;
	f: number;
	l: number;
	T: number;
	m: boolean;
};

export type FuturesChannels = {
	bookTicker: { messageSchema: FuturesBookTickerEvent; subscriptionOptions: never };
	partialBookDepth: {
		messageSchema: FuturesBookDepthEvent;
		subscriptionOptions: { levels: number; updateSpeedMs?: number };
	};
	aggTrade: { messageSchema: FuturesAggTradeEvent; subscriptionOptions: never };
};
