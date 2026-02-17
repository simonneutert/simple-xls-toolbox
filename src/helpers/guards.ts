// @ts-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import { WorkBook } from "xlsx";
import { ZodRowResult } from "../validate-excel.ts";

export function hasIssues(row: ZodRowResult): boolean {
  return row.issues &&
    (row.issues instanceof Array) &&
    row.issues.length > 0;
}

export function isString(val: unknown): val is string {
  return typeof val === "string";
}

export function sanitizePathPart(pathPart: string | number): string {
  return isString(pathPart)
    ? `${pathPart}`.replace(/\n/g, "\\n")
    : String(pathPart);
}

export function isSheetNameValid(
  workbook: WorkBook,
  sheetName: string,
): boolean {
  return typeof sheetName === "string" && sheetName in workbook.Sheets;
}

export function validateSheetName(
  workbook: WorkBook,
  sheetName: string,
): string {
  if (!isSheetNameValid(workbook, sheetName)) {
    console.error(
      `Sheet "${sheetName}" not found in the workbook. Available sheets: ${
        Object.keys(workbook.Sheets).join(", ")
      }`,
    );
    Deno.exit(1);
  }
  return sheetName;
}
