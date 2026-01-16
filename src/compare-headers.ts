// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"

import * as XLSX from "xlsx";
import * as cptable from "cpexcel";
import { parseArgs } from "@std/cli";
import { excelColNumberToName } from "./helpers/excel-col-number-to-name.ts";

export type CollectionSwap = {
  header: string;
  from: number;
  to: number;
  fromCol: string;
  toCol: string;
};

export function parseWorksheet(file: string, sheet: string) {
  const filePath = `${Deno.cwd()}/${file}`;
  const workbook = XLSX.readFile(filePath);
  return workbook.Sheets[sheet];
}

export function parseHeaders(worksheet: XLSX.WorkSheet): string[] {
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });
  const result = rows[0] as string[];
  if (!result) {
    throw new Error(
      "No header row found in worksheet. Sheet may be empty or missing headers.",
    );
  }
  return underScoreAndIndexDuplicates(result);
}

export function underScoreAndIndexDuplicates(headers: string[]) {
  const seen: Record<string, number> = {};
  const result: Record<string, string> = {};

  Object.values(headers).forEach((header) => {
    if (seen[header] !== undefined) {
      seen[header] += 1;
      result[`${header}_${seen[header]}`] = header;
    } else {
      seen[header] = 0;
      result[header] = header;
    }
  });

  return Object.keys(result);
}

function findMismatches(headers1: string[], headers2: string[]) {
  const mismatches: Array<{ index: number; header1: string; header2: string }> =
    [];
  const minLen = Math.min(headers1.length, headers2.length);
  for (let i = 0; i < minLen; i++) {
    if (headers1[i] !== headers2[i]) {
      mismatches.push({ index: i, header1: headers1[i], header2: headers2[i] });
    }
  }
  // If one header list is longer, add those as mismatches too
  if (headers1.length > headers2.length) {
    for (let i = headers2.length; i < headers1.length; i++) {
      mismatches.push({ index: i, header1: headers1[i], header2: "" });
    }
  } else if (headers2.length > headers1.length) {
    for (let i = headers1.length; i < headers2.length; i++) {
      mismatches.push({ index: i, header1: "", header2: headers2[i] });
    }
  }
  return mismatches;
}

export function compareHeaders(
  headers1: string[],
  headers2: string[],
): CollectionSwap[] {
  const onlyInFile1 = headers1.filter((h) => !headers2.includes(h));
  const onlyInFile2 = headers2.filter((h) => !headers1.includes(h));
  const mismatches = findMismatches(headers1, headers2);

  console.log("Headers only in file 1:", onlyInFile1);
  console.log("Headers only in file 2:", onlyInFile2);

  const collectionSwaps: CollectionSwap[] = [];
  if (
    onlyInFile1.length === 0 && onlyInFile2.length === 0 &&
    mismatches.length === 0
  ) {
    console.log("Headers match perfectly.");
    return [];
  } else if (mismatches.length > 0) {
    console.log("Header order/content mismatches detected:");
    // deno-lint-ignore no-unused-vars
    mismatches.forEach(({ index, header1, header2 }) => {
      if (headers1.includes(header2)) {
        const hidx2 = headers1.indexOf(header2);
        const fromColName = excelColNumberToName(hidx2 + 1);
        const toColName = excelColNumberToName(index + 1);

        collectionSwaps.push({
          header: header2,
          from: hidx2,
          to: index,
          fromCol: fromColName,
          toCol: toColName,
        });
      }
    });
    printCollectionSwaps(collectionSwaps);
    return collectionSwaps;
  }
  // Always return an array if no conditions above are met
  return [];
}

export function printCollectionSwaps(swaps: CollectionSwap[]): string {
  let message = "";
  if (swaps.length > 0) {
    // deno-lint-ignore no-unused-vars
    swaps.forEach(({ header, from, to, fromCol, toCol }) => {
      const nextMessage =
        `🔄 Header: '${header}' moved from: ${fromCol} to: ${toCol}\n`;
      console.log(
        nextMessage,
      );
      message += nextMessage;
    });
  } else {
    const nextMessage = "No header swaps detected.\n";
    console.log(nextMessage);
    message += nextMessage;
  }
  return message;
}
export function compareHeadersCall(cliArgs: string[]) {
  XLSX.set_cptable(cptable);

  const args = parseArgs(cliArgs, {
    string: ["file1", "file2", "sheet1", "sheet2"],
  });

  const allHeaders: string[][] = [];

  let configArgs: string[][] = [[], []];
  if (Deno.env.get("NODE_ENV") === "test") {
    configArgs = [["test/resources/test1.xlsx", "data"], [
      "test/resources/test2.xlsx",
      "data",
    ]];
  } else {
    configArgs = [
      [args.file1!, args.sheet1!],
      [args.file2!, args.sheet2!],
    ];
  }

  configArgs.forEach(
    ([file, sheet], index) => {
      const worksheet = parseWorksheet(file, sheet);
      const headers = parseHeaders(worksheet);
      console.log(`Headers in ${file} (${sheet}):`, headers);
      allHeaders[index] = headers;
    },
  );
  compareHeaders(allHeaders[0], allHeaders[1]);
}
