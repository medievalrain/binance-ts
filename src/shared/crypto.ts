import { createHmac } from "node:crypto";

export const createHmac256 = (message: string, secret: string): string => {
	return createHmac("sha256", secret).update(message).digest("hex");
};
