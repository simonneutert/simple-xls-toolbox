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
import {
  hasIssues,
  sanitizePathPart,
  validateSheetName,
} from "./helpers/guards.ts";
import { loadSchema } from "./load-schema.ts";

export type ZodRowResult = {
  data: Record<string, unknown>;
  isValid: boolean;
  issues: Array<{
    code: string;
    message: string;
    path: string[];
    values?: unknown[];
  }>;
};

function logInvalids(result: Record<string, unknown>): string | null {
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

function printRow(row: ZodRowResult, rowMessage: string): string | void {
  if (!hasIssues(row)) {
    console.log("No issues found for this row.");
    return;
  }

  let message = rowMessage + "\n";
  row.issues.forEach((issue) => {
    issue.path.forEach((pathPart: string | number, _index: number) => {
      const newMessage = `\t- Field "${sanitizePathPart(pathPart)}": Value: "${
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
): void {
  const onlyinFile1 = sheetColumns.filter((col) => !schemaHeader.includes(col));
  const onlyinFile2 = schemaHeader.filter((col) => !sheetColumns.includes(col));
  if (onlyinFile1.length > 0) {
    console.log(
      "Headers only in the Excel sheet:\n",
      onlyinFile1.join(", ") || "None",
    );
  }
  if (onlyinFile2.length > 0) {
    console.log(
      "Headers only in the schema:\n",
      onlyinFile2.join(", ") || "None",
    );
  }
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

  const schema: ZodObject = await loadSchema(args.validateSheet!);
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
