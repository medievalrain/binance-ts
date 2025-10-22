import { z } from "zod";

export class ApiError extends Error {
	public endpoint: string;

	constructor({ endpoint, metadata }: { endpoint: string; metadata: Record<string, unknown> }) {
		super(JSON.stringify({ endpoint, ...metadata }, null, 2));
		this.endpoint = endpoint;
	}
}

export class ValidationError<T extends z.ZodType> extends ApiError {
	public error?: z.ZodError<z.output<T>>;
	public input: unknown;

	constructor({ error, input, endpoint }: { error?: z.ZodError<z.output<T>>; input?: unknown; endpoint: string }) {
		super({ endpoint, metadata: { error, input } });
		this.error = error;
		this.input = input;
	}
}

export class ResponseError extends ApiError {
	public code: number;
	public status: number;

	constructor({
		metadata,
		code,
		status,
		endpoint,
	}: {
		metadata?: Record<string, unknown>;
		endpoint: string;
		code: number;
		status: number;
	}) {
		super({ endpoint, metadata: { ...metadata, code, status } });
		this.code = code;
		this.status = status;
	}
}

export class ErrorMessageParsingError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class WeightError extends ResponseError {
	public ip: string;
	public bannedUntil: number;

	constructor({ message, endpoint }: { message: string; endpoint: string }) {
		super({ endpoint, code: -1003, status: 418 });
		const { ip, timestamp } = this.parseWeightResponse(message);
		this.ip = ip;
		this.bannedUntil = timestamp;
	}

	private parseWeightResponse(message: string) {
		const match = message.match(/IP\(([^)]+)\).*?until (\d+)/);

		if (!match) {
			throw new ErrorMessageParsingError("Can't parse weight data");
		}

		const ip = String(match[1]);
		const timestamp = Number(match[2]);
		return { ip, timestamp };
	}
}

export class MalformedParamError extends ResponseError {
	public param: string;

	constructor({ message, endpoint }: { message: string; endpoint: string }) {
		super({ endpoint, code: -1102, status: 400 });
		const param = this.parseParam(message);
		this.param = param;
	}

	private parseParam(message: string) {
		const match = message.match(/'([^']+)'/);

		if (!match) {
			throw new ErrorMessageParsingError("Can't parse param data");
		}

		return String(match[1]);
	}
}
