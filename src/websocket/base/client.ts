import { Emitter } from "../typed-event-emitter";
import type { ConnectionErrorEvent, ConnectionEvent } from "./types";

import { WebSocket, MessageEvent } from "undici";

type WebsocketClientEventMap<MarketEvent extends object> = {
	marketMessage: (data: MarketEvent) => void;
	connectionMessage: (data: ConnectionEvent) => void;
	error: (error: Error | ConnectionErrorEvent) => void;
};
type SubscriptionState = "SUBSCRIBED" | "PENDING_SUBSCRIPTION" | "PENDING_UNSUBSCRIPTION";

export class BinanceWebsocketClient<MarketEvent extends object> {
	private socket: WebSocket;
	private baseUrl: string;
	private emitter = new Emitter<WebsocketClientEventMap<MarketEvent>>();
	private subscriptionId: number = 1;

	private subscriptions = new Map<string, SubscriptionState>();

	constructor(baseUrl: string) {
		this.parseEvent = this.parseEvent.bind(this);
		this.baseUrl = baseUrl;
		this.socket = this.createSocket();
	}

	private createSocket() {
		if (this.socket) {
			this.socket.removeEventListener("message", this.parseEvent);
			this.socket.close();
		}
		const socket = new WebSocket(this.baseUrl);
		socket.addEventListener("message", this.parseEvent);
		return socket;
	}

	private sendMessage(data: object) {
		this.socket.send(JSON.stringify(data));
	}

	private parseEvent(e: MessageEvent) {
		if (typeof e.data !== "string") {
			this.emitter.emit("error", new Error("Message event is not a string", { cause: e.data }));
			return;
		}
		const data = JSON.parse(e.data) as ConnectionEvent | MarketEvent;

		if ("id" in data) {
			this.emitter.emit("connectionMessage", data);
		} else {
			this.emitter.emit("marketMessage", data);
		}
	}

	public async subscribe(...channels: string[]) {
		await this.connect();
		const pendingChannels: string[] = [];
		for (const channel of channels) {
			const existingChannelState = this.subscriptions.get(channel);
			if (!existingChannelState) {
				pendingChannels.push(channel);
				this.subscriptions.set(channel, "PENDING_SUBSCRIPTION");
			}
		}
		const id = this.subscriptionId;
		const data = {
			method: "SUBSCRIBE",
			params: pendingChannels,
			id,
		};
		this.subscriptionId += 1;

		this.sendMessage(data);
		return new Promise<void>((resolve, reject) => {
			const controller = new AbortController();
			const handler: WebsocketClientEventMap<MarketEvent>["connectionMessage"] = (data) => {
				if (data.id !== id) {
					return;
				}
				controller.abort();
				if ("error" in data) {
					for (const channel of pendingChannels) {
						const existingChannelState = this.subscriptions.get(channel);
						if (existingChannelState === "PENDING_SUBSCRIPTION") {
							this.subscriptions.delete(channel);
						}
					}
					this.emitter.emit("error", data);
					reject(new Error(`Subscription ${id} failed`));
				} else {
					pendingChannels.forEach((channel) => this.subscriptions.set(channel, "SUBSCRIBED"));
					resolve();
				}
			};
			this.emitter.addEventListener("connectionMessage", handler, { signal: controller.signal });
		});
	}

	public async unsubscribe(...channels: string[]) {
		await this.connect();
		// @TODO implement
	}

	public async reconnect() {
		this.socket = this.createSocket();
		await this.connect();
		const toRestore: string[] = [];
		for (const [channel, state] of this.subscriptions) {
			if (state !== "PENDING_UNSUBSCRIPTION") toRestore.push(channel);
		}
		if (toRestore.length) {
			await this.subscribe(...toRestore);
		}
	}

	public async connect() {
		if (this.socket.readyState === WebSocket.OPEN) {
			return;
		}
		if (this.socket.readyState === WebSocket.CONNECTING) {
			return new Promise<void>((resolve, reject) => {
				this.socket.addEventListener("open", () => resolve(), { once: true });
				this.socket.addEventListener("close", () => reject(), { once: true });
			});
		}

		return this.reconnect();
	}

	public addEventListener<E extends keyof WebsocketClientEventMap<MarketEvent>>(
		event: E,
		callback: WebsocketClientEventMap<MarketEvent>[E],
		options?: AddEventListenerOptions
	) {
		this.emitter.addEventListener(event, callback, options);
	}
}
