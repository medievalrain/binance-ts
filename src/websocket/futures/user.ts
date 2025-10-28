import { createEmitter } from "@medievalrain/emitter";
import type { CallbackOptions } from "@medievalrain/emitter";

import { futuresEventRouting } from "./types/user";
import type { FuturesUserEvent, FuturesUserWebsocketClient, InferFutruresUserEvent, UserEventMap } from "./types/user";
import { FuturesRestClient } from "@/rest/futures/client";

export const createFuturesUserWebsocketClient = async ({
	baseUrl = "wss://fstream.binance.com/ws",
	apiKey,
	apiSecret,
}: {
	baseUrl?: string;
	apiKey: string;
	apiSecret: string;
}): Promise<FuturesUserWebsocketClient> => {
	let socket: WebSocket;
	const futuresRestClient = new FuturesRestClient({ apiKey, apiSecret });
	let connectionController = new AbortController();
	let listenKeyUpdateInterval: NodeJS.Timeout;

	const emitter = createEmitter<UserEventMap>();

	const invertedRouting = Object.fromEntries(Object.entries(futuresEventRouting).map(([key, value]) => [value, key])) as {
		[K in (typeof futuresEventRouting)[keyof typeof futuresEventRouting]]: Extract<
			keyof typeof futuresEventRouting,
			{
				[P in keyof typeof futuresEventRouting]: (typeof futuresEventRouting)[P] extends K ? P : never;
			}[keyof typeof futuresEventRouting]
		>;
	};

	const parseMessageEvent = (e: MessageEvent) => {
		if (typeof e.data !== "string") return;

		const data = JSON.parse(e.data) as FuturesUserEvent;
		const routedEvent = invertedRouting[data.e];
		emitter.emit(routedEvent, data as Extract<FuturesUserEvent, { e: typeof routedEvent }>);
	};

	const on = <MethodName extends keyof typeof futuresEventRouting>(
		method: MethodName,
		callback: (data: InferFutruresUserEvent<(typeof futuresEventRouting)[MethodName]>, options?: CallbackOptions) => void,
		options?: CallbackOptions
	) => {
		emitter.on(method, callback as any, options);
	};

	const off = <MethodName extends keyof typeof futuresEventRouting>(
		method: MethodName,
		callback: (data: InferFutruresUserEvent<(typeof futuresEventRouting)[MethodName]>, options?: CallbackOptions) => void
	) => {
		emitter.off(method, callback as any);
	};

	const connect = async () => {
		return new Promise<void>((resolve) => {
			if (!socket || socket.readyState === WebSocket.CLOSED) {
				clearInterval(listenKeyUpdateInterval);
				futuresRestClient.getListenKey().then(({ listenKey: newListenKey }) => {
					let listenKey = newListenKey;
					let url = `${baseUrl}/${listenKey}`;
					listenKeyUpdateInterval = setInterval(
						async () => {
							listenKey = (await futuresRestClient.getListenKey()).listenKey;
							// @TODO handle error
						},
						30 * 1000 * 60
					);

					connectionController.abort();
					socket = new WebSocket(url);
					connectionController = new AbortController();
					socket.addEventListener(
						"open",
						() => {
							socket.addEventListener("message", parseMessageEvent, { signal: connectionController.signal });
							resolve();
						},
						{ once: true }
					);
				});
				return;
			}
			if (socket.readyState === WebSocket.OPEN) {
				return resolve();
			}

			if (socket.readyState === WebSocket.CONNECTING) {
				socket.addEventListener(
					"open",
					() => {
						socket.addEventListener("message", parseMessageEvent, { signal: connectionController.signal });
						resolve();
					},
					{ once: true }
				);
			}
			if (socket.readyState === WebSocket.CLOSING) {
				socket.addEventListener(
					"close",
					async () => {
						await connect();
						resolve();
					},
					{ once: true }
				);
			}
		});
	};

	await connect();

	const handler: ProxyHandler<{}> = {
		get(_target, method: keyof typeof futuresEventRouting) {
			return Object.freeze({
				on: (
					callback: (data: InferFutruresUserEvent<(typeof futuresEventRouting)[typeof method]>) => void,
					options?: CallbackOptions
				) => {
					on(method, callback, options);
				},
				off: (callback: (data: InferFutruresUserEvent<(typeof futuresEventRouting)[typeof method]>) => void) => {
					off(method, callback);
				},
			});
		},
	};
	return new Proxy({}, handler) as FuturesUserWebsocketClient;
};
