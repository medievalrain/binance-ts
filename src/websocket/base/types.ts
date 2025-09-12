export type ConnectionSuccessEvent = {
	result: null;
	id: number;
};

export type ConnectionErrorEvent = {
	result: null;
	id: number;
	status: number;
	error: {
		code: number;
		msg: string;
	};
};

export type ConnectionEvent = ConnectionSuccessEvent | ConnectionErrorEvent;

export type ChannelsMap = Record<string, object>;

export type SubscriptionState = "SUBSCRIBED" | "PENDING_SUBSCRIPTION" | "PENDING_UNSUBSCRIPTION";

export type WebsocketClient<T extends Record<string, object>> = {
	[K in keyof T]: {
		subscribe: (...symbols: string[]) => Promise<void>;
		unsubscribe: (...symbols: string[]) => Promise<void>;
		addEventListener: (cb: (data: T[K]) => void, options?: AddEventListenerOptions) => void;
	};
};

export type WebsocketClientEventMap<MarketEvent extends object> = {
	marketMessage: (data: MarketEvent) => void;
	connectionMessage: (data: ConnectionEvent) => void;
	error: (error: Error | ConnectionErrorEvent) => void;
};
