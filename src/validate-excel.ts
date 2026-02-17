// deno-lint-ignore no-unused-vars
import { generateStringCombinations } from "@simonneutert/string-combinations-generator";
// 👆️ // Keep this import so that `generateStringCombinations` is bundled when
// `deno compile` is used. This ensures the function is available to schema
// files that reference it, such as `sample_schema.js`.

import { parseArgs } from "@std/cli";
import * as XLSX from "xlsx";
import { createValidator } from "zod-xlsx";
import { ZodObject } from "zod";

// @ts-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import { WorkBook } from "xlsx";

async function loadSchema(sheetPath: string): Promise<ZodObject> {
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

function findExclusiveColumns(
  sheetColumns: string[],
  schemaHeader: string[],
) {
  const onlyinFile1 = sheetColumns.filter((col) => !schemaHeader.includes(col));
  const onlyinFile2 = schemaHeader.filter((col) => !sheetColumns.includes(col));
  console.log(
    "Headers only in the Excel sheet:\n",
    onlyinFile1.join(", ") || "None",
  );
  console.log(
    "Headers only in the schema:\n",
    onlyinFile2.join(", ") || "None",
  );
}

function validateSheetName(workbook: WorkBook, sheetName: string) {
  if (!(typeof sheetName === "string" && sheetName in workbook.Sheets)) {
    console.error(
      `Sheet "${sheetName}" not found in the workbook. Available sheets: ${
        Object.keys(workbook.Sheets).join(", ")
      }`,
    );
    Deno.exit(1);
  }
  return sheetName;
}

export async function validateExcelData(
  cliArgs: string[],
  callback?: (message: string) => string,
) {
  const args = parseArgs(cliArgs, {
    string: ["file", "sheet", "validateSheet"],
  });

  const file = `${Deno.cwd()}/${args.file!}`;
  const workbook = XLSX.readFile(file) as WorkBook;
  const sheetName = validateSheetName(workbook, args.sheet!);
  const validator = createValidator(workbook, {
    sheetName: sheetName,
  });

  let schema: ZodObject;
  if (args.validateSheet && args.validateSheet.endsWith(".js")) {
    schema = await loadSchema(args.validateSheet);
  } else {
    console.warn(
      "No valid schema provided, using default schema for demonstration.",
    );
    Deno.exit(1);
  }

  const xlsxUtils = XLSX.utils as XLSX.XLSX$Utils;
  const sheetObject = xlsxUtils.sheet_to_json(workbook.Sheets[sheetName]);
  const sheetColumnNames = Object.keys(sheetObject[0] || {});
  const schemaHeader = Object.keys(schema.shape);
  findExclusiveColumns(sheetColumnNames, schemaHeader);

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
