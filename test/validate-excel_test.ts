import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { validateExcelData } from "../src/validate-excel.ts";

Deno.test(async function testValidateExcelDataMessage() {
  let message = "";
  await validateExcelData(
    [
      "--file",
      "./test/resources/sample_validation.xlsx",
      "--sheet",
      "sheet1",
      "--validateSheet",
      "./test/resources/sample_schema.js",
    ],
    (msg: string) => {
      message += msg;
      return msg;
    },
  );

  // This is true for the current sample_validation.xlsx and sample_schema.js
  // For future implementations:
  // Row 2 in sample_validation.xlsx should be kept valid in all examples, at all times!
  //
  // This is meant to be a sanity check to ensure that valid rows are not reported as invalid.
  assert(!message.includes("Row 2"));

  // check for other rows and specific error messages
  assert(
    message.includes("Row with first column value '1' has invalid fields."),
  );
  assert(
    message.includes('- Field "FoodOrder": Value: "Salad,Fries,Fries,Soda"'),
  );
  assert(message.includes("Invalid food order combination"));
  assertEquals(
    message.includes("Row with first column value '4' has invalid fields."),
    true,
  );
  assertEquals(
    message.includes("Row with first column value '5' has invalid fields."),
    true,
  );
  assertEquals(
    message.includes('Invalid option: expected one of "Yes"|"No"'),
    true,
  );
  assertEquals(message.includes('Field "HaveYouEver": Value: "NO" '), true);
  assertEquals(
    message.includes("Too small: expected string to have >=3 characters"),
    true,
  );
  assertEquals(message.includes('Field "Col with\\nLineBreak"'), true);
});

Deno.test(async function testValidateExcelData() {
  let message = "";
  const result = await validateExcelData(
    [
      "--file",
      "./test/resources/sample_validation.xlsx",
      "--sheet",
      "sheet1",
      "--validateSheet",
      "./test/resources/sample_schema.js",
    ],
    (msg: string) => {
      message += msg;
      return msg;
    },
  );

  assertEquals(result.length, 3);

  const resultRow1 = result[0];
  const resultRow2 = result[1];
  const resultRow3 = result[2];

  assertEquals(resultRow1.isValid, false);
  assertEquals(resultRow1.data.Levels, 1);
  assert(typeof resultRow1 === "object");
  assertInstanceOf(resultRow1.issues, Array);
  assert(typeof resultRow1.issues[0] == "object");
  assertEquals(resultRow1.issues.length, 1);
  assertEquals(
    (resultRow1.issues[0] as { message: string }).message,
    "Invalid food order combination",
  );

  assertEquals(resultRow2.data.Levels, 4);
  assert(typeof resultRow2 === "object");
  assertInstanceOf(resultRow2.issues, Array);
  assert(typeof resultRow2.issues[0] == "object");
  assertEquals(resultRow2.issues.length, 2);
  assertEquals(
    (resultRow2.issues[0] as { message: string }).message,
    'Invalid option: expected one of "Yes"|"No"',
  );
  assertEquals(
    (resultRow2.issues[1] as { message: string }).message,
    'Invalid option: expected one of "red"|"green"|"blue"',
  );

  assert(resultRow2.issues[0] !== null);
  assertEquals(Object.keys(resultRow2.issues[0] as object), [
    "code",
    "values",
    "path",
    "message",
  ]);

  assert(resultRow2.data !== null);
  assertEquals(Object.keys(resultRow2.data as object), [
    "Levels",
    "Description",
    "HaveYouEver",
    "Colors",
    "Drinks",
    "Random",
    "Col with\nLineBreak",
    "FoodOrder",
  ]);

  assertEquals(resultRow2.data.Levels, 4);
  assertEquals(resultRow2.isValid, false);

  assertEquals(resultRow3.isValid, false);
  assertEquals(resultRow3.data.Levels, 5);
  assertEquals(resultRow3.issues.length, 5);
  assertEquals(
    (resultRow3.issues[0] as { message: string }).message,
    "Too small: expected string to have >=3 characters",
  );
  assertEquals(
    (resultRow3.issues[1] as { message: string }).message,
    'Invalid option: expected one of "Yes"|"No"',
  );
  assertEquals(
    (resultRow3.issues[2] as { message: string }).message,
    'Invalid option: expected one of "red"|"green"|"blue"',
  );

  assertEquals(
    (resultRow3.issues[3] as { code: string }).code,
    "custom",
  );
  assertEquals(
    (resultRow3.issues[3] as { message: string }).message,
    "Each 'drink' must be a non-empty string",
  );
});
