import type { WebsocketClient } from "@/websocket/base";
import type { FuturesChannels } from "./channels";

export type FuturesWebsocketClient = WebsocketClient<FuturesChannels>;
