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

export type FuturesChannels = {
	bookTicker: FuturesBookTickerEvent;
	depth: FuturesBookDepthEvent;
};
