import { WebSocket, MessageEvent } from "undici";
import type {
	ChannelsMap,
	ConnectionEvent,
	OptArgs,
	SubscriptionState,
	SymbolConverter,
	WebsocketClient,
	WebsocketClientEventMap,
} from "./types";
import { Emitter } from "../typed-event-emitter";

type Section<MarketEvent extends object> = {
	socket: WebSocket;
	subscriptions: Map<string, SubscriptionState>;
	connectionId: number;
	addEventListener: <E extends keyof WebsocketClientEventMap<MarketEvent>>(
		event: E,
		callback: WebsocketClientEventMap<MarketEvent>[E],
		options?: AddEventListenerOptions
	) => void;
	subscribe: (symbols: string[]) => Promise<void>;
	unsubscribe: (symbols: string[]) => Promise<void>;
};

const makeSection = <MarketEvent extends object>(baseUrl: string): Section<MarketEvent> => {
	let socket = new WebSocket(baseUrl);
	let connectionController = new AbortController();

	const subscriptions = new Map<string, SubscriptionState>();
	const emitter = new Emitter<WebsocketClientEventMap<MarketEvent>>();
	let connectionId = 1;

	const parseMessageEvent = (e: MessageEvent) => {
		if (typeof e.data !== "string") {
			emitter.emit("error", new Error("Message event is not a string", { cause: e.data }));
			return;
		}
		const data = JSON.parse(e.data) as ConnectionEvent | MarketEvent;

		if ("id" in data) {
			emitter.emit("connectionMessage", data);
		} else {
			emitter.emit("marketMessage", data);
		}
	};

	socket.addEventListener("message", parseMessageEvent, { signal: connectionController.signal });

	const sendMessage = <T extends object>(data: T) => socket.send(JSON.stringify(data));

	const connect = async () => {
		return new Promise<void>((resolve) => {
			if (socket.readyState === WebSocket.OPEN) {
				return resolve();
			}

			if (socket.readyState === WebSocket.CLOSED) {
				connectionController.abort();
				socket = new WebSocket(baseUrl);
				connectionController = new AbortController();
				socket.addEventListener("message", parseMessageEvent, { signal: connectionController.signal });
				connectionId = 1;
				const toSubscribe = Array.from(subscriptions.entries())
					.filter(([_, state]) => state !== "PENDING_UNSUBSCRIPTION")
					.map(([key]) => key);

				return subscribe(toSubscribe);
			}

			if (socket.readyState === WebSocket.CONNECTING) {
				socket.addEventListener("open", () => resolve(), { once: true });
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

	const subscribe = async (symbols: string[]) => {
		await connect();
		const toSubscribe: string[] = [];
		const delayed: string[] = [];
		connectionId += 1;
		const currentId = connectionId;
		symbols.forEach((symbol) => {
			const existing = subscriptions.get(symbol);
			if (!existing) {
				toSubscribe.push(symbol);
				subscriptions.set(symbol, "PENDING_SUBSCRIPTION");
				return;
			}
			if (existing === "SUBSCRIBED") {
				return;
			}
			delayed.push(symbol);
		});

		sendMessage({
			method: "SUBSCRIBE",
			params: toSubscribe,
			id: currentId,
		});

		const waitForSub = new Promise<void>((resolve, reject) => {
			const controller = new AbortController();
			const handleSubscription = (data: ConnectionEvent) => {
				if (data.id !== currentId) {
					return;
				}
				controller.abort();
				if ("error" in data) {
					return reject();
				} else {
					toSubscribe.forEach((symbol) => subscriptions.set(symbol, "SUBSCRIBED"));

					return resolve();
				}
			};
			emitter.addEventListener("connectionMessage", handleSubscription, { signal: controller.signal });
			// @TODO add timeout
		});

		await waitForSub;

		if (delayed.length) {
			return subscribe(delayed);
		}
	};
	const unsubscribe = async (symbols: string[]) => {
		await connect();
		// @TODO
	};

	return {
		socket,
		subscriptions,
		connectionId,
		addEventListener: emitter.addEventListener.bind(emitter),
		subscribe,
		unsubscribe,
	};
};

export const createWebsocketClient = <CM extends ChannelsMap>(baseUrl: string, symbolConverter: SymbolConverter<CM>) => {
	const sections = new Map<keyof CM, Section<CM[keyof CM]["messageSchema"]>>();

	const getSection = (channel: keyof CM) => {
		const existingSection = sections.get(channel);
		if (existingSection) {
			return existingSection;
		}
		const section = makeSection(baseUrl);
		sections.set(channel, section);
		return section;
	};

	const handler: ProxyHandler<{}> = {
		get(_target, channel: keyof CM & string) {
			const section = getSection(channel);
			const converter = symbolConverter[channel];

			return Object.freeze({
				subscribe: (symbols: string[], ...args: OptArgs<CM, typeof channel>) => {
					return section.subscribe(symbols.map((s) => converter(s, ...args)));
				},
				unsubscribe: (symbols: string[], ...args: OptArgs<CM, typeof channel>) => {
					return section.unsubscribe(symbols.map((s) => converter(s, ...args)));
				},
				addEventListener: (
					callback: (data: CM[typeof channel]["messageSchema"]) => void,
					options?: AddEventListenerOptions
				) => {
					section.addEventListener("marketMessage", callback, options);
				},
			});
		},
	};
	return new Proxy({}, handler) as WebsocketClient<CM>;
};
