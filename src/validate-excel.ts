import { parseArgs } from "@std/cli";
import * as XLSX from "xlsx";
import { createValidator } from "zod-xlsx";
import { z } from "zod";

// deno-lint-ignore no-unused-vars
import { generateStringCombinations } from "@simonneutert/string-combinations-generator";
// 👆️ // Keep this import so that `generateStringCombinations` is bundled when
// `deno compile` is used. This ensures the function is available to schema
// files that reference it, such as `sample_schema.js`.

async function loadSchema(sheetPath: string): Promise<z.ZodTypeAny> {
  const imported = await import(
    new URL(sheetPath, `file://${Deno.cwd()}/`).href
  );
  const schema = imported.default || imported.schema;
  if (!schema) throw new Error("No schema exported from JS file");
  return schema;
}

function logInvalids(result: Record<string, unknown>) {
  if (!("invalid" in result)) {
    console.log("No invalid entries found in the result.");
    return null;
  }
  let messages = "";
  if (result.invalid && result.invalid instanceof Array) {
    result.invalid.forEach((row) => {
      const rowMessage = `\nRow with first column value '${
        String(row.data[Object.keys(row.data)[0]]).slice(0, 24)
      }' has invalid fields.`;
      console.log(rowMessage);
      const message = printRow(row, rowMessage);
      if (message) {
        messages += message;
      }
    });
  }
  return messages;
}

type ZodRowResult = {
  data: Record<string, unknown>;
  isValid: boolean;
  issues: Array<{
    code: string;
    message: string;
    path: string[];
    values?: unknown[];
  }>;
};

function hasIssues(row: ZodRowResult): boolean {
  return row.issues &&
    (row.issues instanceof Array) &&
    row.issues.length > 0;
}

function isString(val: unknown): val is string {
  return typeof val === "string";
}

function printRow(row: ZodRowResult, rowMessage: string): string | void {
  if (!hasIssues(row)) {
    console.log("No issues found for this row.");
    return;
  }

  let message = rowMessage + "\n";
  row.issues.forEach((issue) => {
    issue.path.forEach((pathPart: string | number, _index: number) => {
      const pathStr = isString(pathPart)
        ? `${pathPart}`.replace(/\n/g, "\\n")
        : String(pathPart);
      const newMessage = `\t- Field "${pathStr}": Value: "${
        row.data[pathPart]
      }" \n\t${issue.message}`;
      console.log(newMessage);
      message += newMessage;
    });
  });
  return message;
}

export async function validateExcelData(
  cliArgs: string[],
  callback?: (message: string) => string,
) {
  const args = parseArgs(cliArgs, {
    string: ["file", "sheet", "validateSheet"],
  });

  const file = `${Deno.cwd()}/${args.file!}`;
  const workbook = XLSX.readFile(file);
  console.log(workbook);
  const validator = createValidator(workbook);

  let schema: z.ZodTypeAny;
  if (args.validateSheet && args.validateSheet.endsWith(".js")) {
    schema = await loadSchema(args.validateSheet);
  } else {
    console.warn(
      "No valid schema provided, using default schema for demonstration.",
    );
    Deno.exit(1);
  }
  const result = validator.validate(schema);
  const message = logInvalids(result);
  if (callback) {
    callback(message || "No invalid entries found.");
  }
  return result.invalid;
}

if (import.meta.main) {
  await validateExcelData(Deno.args);
}
