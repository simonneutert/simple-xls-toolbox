export function isHelp(): boolean {
  return !Deno.args[0] ||
    (Deno.args[0] == "-h" || Deno.args[0].includes("help"));
}

export function printHelpAndExit() {
  console.log("Usage:");
  console.log(
    "  deno main.ts compare-headers --file1 <pathToXLS_1> --sheet1 <nameOfSheet1> --file2 <pathToXLS_2> --sheet2 <nameOfSheet2>",
  );
  console.log(
    "  deno main.ts validate-excel --file <pathToXLS> --sheet <sheetName> --validateSheet <pathToValidateSheet>",
  );
  Deno.exit(0);
}
