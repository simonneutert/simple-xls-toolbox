import { Args } from "@std/cli/parse-args";
import { isEnvTest } from "../env-checks.ts";

export function guardCompareHeadersArgs(args: Args) {
  if (
    !isEnvTest() && (!args.file1 || !args.file2 || !args.sheet1 || !args.sheet2)
  ) {
    console.log("Arguments:", args);
    console.error(
      "Usage: deno main.ts compare-headers --file1 <file1> --sheet1 <sheet1> --file2 <file2> --sheet2 <sheet2>",
    );
    Deno.exit(1);
  }
}
