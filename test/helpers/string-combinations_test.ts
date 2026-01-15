import { generateStringCombinations } from "../../src/helpers/string-combinations.ts";

Deno.test("generateStringCombinations returns all combinations for 'abc'", () => {
  const input = ["a", "b", "c"];
  const expected = [
    "a",
    "b",
    "c",
    "a,b",
    "a,c",
    "b,a",
    "b,c",
    "c,a",
    "c,b",
    "a,b,c",
    "a,c,b",
    "b,a,c",
    "b,c,a",
    "c,a,b",
    "c,b,a",
  ];
  const result = generateStringCombinations(input);
  for (const combo of expected) {
    if (!result.includes(combo)) {
      throw new Error(`Missing combination: ${combo}`);
    }
  }
  if (result.length !== expected.length) {
    throw new Error(
      `Expected ${expected.length} combinations, got ${result.length}`,
    );
  }
});
