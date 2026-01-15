import { assertEquals } from "@std/assert";
import { excelColNumberToName } from "../../src/helpers/excel-col-number-to-name.ts";

Deno.test("excelColNumberToName", async (t) => {
  const cases = [
    { input: 1, expected: "A" },
    { input: 26, expected: "Z" },
    { input: 27, expected: "AA" },
    { input: 28, expected: "AB" },
    { input: 52, expected: "AZ" },
    { input: 53, expected: "BA" },
    { input: 702, expected: "ZZ" },
    { input: 703, expected: "AAA" },
  ];
  for (const { input, expected } of cases) {
    await t.step(`${input} -> ${expected}`, () => {
      assertEquals(excelColNumberToName(input), expected);
    });
  }
});
