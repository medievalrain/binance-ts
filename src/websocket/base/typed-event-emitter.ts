export type EventMap = Record<string, (...args: any[]) => void>;

export class Emitter<Events extends EventMap> {
	private eventTarget = new EventTarget();

	public addEventListener<E extends keyof Events & string>(event: E, callback: Events[E], options?: AddEventListenerOptions) {
		this.eventTarget.addEventListener(
			event,
			(event) => callback(...(event as CustomEvent<Parameters<Events[E]>>).detail),
			options
		);
	}

	public emit<E extends keyof Events & string>(event: E, ...data: Parameters<Events[E]>) {
		this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
	}
}
