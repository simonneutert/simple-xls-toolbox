import { assertEquals } from "@std/assert";
import { underScoreAndIndexDuplicates } from "../src/compare-headers.ts";

Deno.test(function testUnderScoreAndIndexDuplicates() {
  assertEquals(
    underScoreAndIndexDuplicates(["a", "a", "b", "b", "b"]),
    ["a", "a_1", "b", "b_1", "b_2"],
  );
});
