import { assertEquals } from "@std/assert";
import {
  CollectionSwap,
  compareHeaders,
  parseHeaders,
  parseWorksheet,
  printCollectionSwaps,
  underScoreAndIndexDuplicates,
} from "../src/compare-headers.ts";

Deno.test(function testUnderScoreAndIndexDuplicates() {
  assertEquals(
    underScoreAndIndexDuplicates(["a", "a", "b", "b", "b"]),
    ["a", "a_1", "b", "b_1", "b_2"],
  );
});

Deno.test(function testCompareHeadersCall() {
  const allHeaders: string[][] = [];
  let configArgs: string[][] = [[], []];

  configArgs = [["test/resources/test1.xlsx", "data"], [
    "test/resources/test2.xlsx",
    "data",
  ]];

  configArgs.forEach(
    ([file, sheet], index) => {
      const worksheet = parseWorksheet(file, sheet);
      const headers = parseHeaders(worksheet);
      console.log(`Headers in ${file} (${sheet}):`, headers);
      allHeaders[index] = headers;
    },
  );
  compareHeaders(allHeaders[0], allHeaders[1]);
  const result: CollectionSwap[] | [] = compareHeaders(
    allHeaders[0],
    allHeaders[1],
  );
  assertEquals(result.length, 1);
  assertEquals(result[0].header, "a");
  assertEquals(result[0].from, 2);
  assertEquals(result[0].fromCol, "C");
  assertEquals(result[0].to, 0);
  assertEquals(result[0].toCol, "A");
});

Deno.test(function testPrintCollectionSwaps() {
  const allHeaders: string[][] = [];
  let configArgs: string[][] = [[], []];

  configArgs = [["test/resources/test1.xlsx", "data"], [
    "test/resources/test2.xlsx",
    "data",
  ]];

  configArgs.forEach(
    ([file, sheet], index) => {
      const worksheet = parseWorksheet(file, sheet);
      const headers = parseHeaders(worksheet);
      allHeaders[index] = headers;
    },
  );
  const result: CollectionSwap[] | [] = compareHeaders(
    allHeaders[0],
    allHeaders[1],
  );
  const message = printCollectionSwaps(result);
  assertEquals(
    message,
    "🔄 Header: 'a' moved from: C to: A\n",
  );

  const messageEmpty = printCollectionSwaps([]);
  assertEquals(
    messageEmpty,
    "No header swaps detected.\n",
  );
});
