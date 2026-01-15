import { parseArgs } from "@std/cli";
import { compareHeadersCall } from "./src/compare-headers.ts";
import { validateExcelData } from "./src/validate-excel.ts";
import { Args } from "@std/cli/parse-args";
import { isHelp, printHelpAndExit } from "./src/helpers/cli/help.ts";
import { guardCompareHeadersArgs } from "./src/helpers/cli/compare-headers.ts";
import { guardValidateExcelArgs } from "./src/helpers/cli/validate-excel.ts";

if (import.meta.main) {
  const args: Args = parseArgs(Deno.args.slice(1), {
    string: ["file1", "file2", "sheet1", "sheet2"],
  });

  if (isHelp()) {
    printHelpAndExit();
  }

  if (Deno.args[0] === "compare-headers") {
    guardCompareHeadersArgs(args);
    // Call the compare headers function
    compareHeadersCall(Deno.args.slice(1));
  } else if (Deno.args[0] === "validate-excel") {
    guardValidateExcelArgs(args);

    validateExcelData(Deno.args.slice(1));
  } else {
    console.log("FIX THIS!");
    Deno.exit(1);
  }
}
