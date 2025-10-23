/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
export default [
	{ name: "futures-rest", input: "src/rest/futures/types.ts", output: "src/rest/futures/__test__/schema.gen.ts" },
	{ name: "spot-rest", input: "src/rest/spot/types.ts", output: "src/rest/spot/__test__/schema.gen.ts" },
	{
		name: "futures-websocket",
		input: "src/websocket/futures/types/events.ts",
		output: "src/websocket/futures/__test__/schema.gen.ts",
	},
];
