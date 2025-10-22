/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
export default [
	{ name: "futures", input: "src/rest/futures/types.ts", output: "src/rest/futures/__test__/schema.gen.ts" },
	{ name: "spot", input: "src/rest/spot/types.ts", output: "src/rest/spot/__test__/schema.gen.ts" },
];
