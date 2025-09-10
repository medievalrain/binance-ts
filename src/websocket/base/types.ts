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
