export type EventMap = Record<string, (...args: any[]) => void>;

export const createEmitter = <Events extends EventMap>() => {
	const eventTarget = new EventTarget();

	const addEventListener = <E extends keyof Events & string>(
		event: E,
		callback: Events[E],
		options?: AddEventListenerOptions
	) => {
		eventTarget.addEventListener(event, (event) => callback(...(event as CustomEvent<Parameters<Events[E]>>).detail), options);
	};

	const removeEventListener = <E extends keyof Events & string>(event: E, callback: Events[E]) => {
		eventTarget.removeEventListener(event, callback);
	};

	const emit = <E extends keyof Events & string>(event: E, ...data: Parameters<Events[E]>) => {
		eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
	};

	return { addEventListener, removeEventListener, emit };
};
