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

export type FuturesMarketEvent = FuturesBookDepthEvent | FuturesBookTickerEvent;

export type FuturesConnectionSuccessEvent = {
	result: null;
	id: number;
};

export type FuturesConnectionErrorEvent = {
	result: null;
	id: number;
	status: number;
	error: {
		code: number;
		msg: string;
	};
};

export type FuturesConnectionEvent = FuturesConnectionSuccessEvent | FuturesConnectionErrorEvent;
