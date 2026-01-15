import { Args } from "@std/cli/parse-args";

export function guardValidateExcelArgs(args: Args) {
  if (
    !(Deno.env.get("NODE_ENV") === "test") &&
    (!args.file || !args.sheet || !args.validateSheet)
  ) {
    console.log("Arguments:", args);
    console.error(
      "Usage: deno main.ts validate-excel --file <pathToXls> --sheet <sheetName> --validateSheet <pathToValidateSheet>",
    );
    Deno.exit(1);
  }
}
