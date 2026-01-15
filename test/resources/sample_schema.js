import { z } from "zod";
import { generateStringCombinations } from "@simonneutert/string-combinations-generator";

// the simplest way is to just have your code inside the schema file
//
// however, for more complex validation logic, you may want to import
// helper functions from other files or packages.
//
// in order for this to work, copy your `.js` file to your local project,
// where your schema lives or adjust the import accordingly, before executing the script.
//
// example:
//
// ```js
//   $ ./simple-xls-toolbox validate-excel \
//       --file ./myExcel.xlsx
//       --sheet mySheetName
//       --validateSheet my_sample_schema.js // relies on code from example-helper.js
// ```
//
// example dir structure for a rich, functional schema:
// .
// ├── simple-xls-toolbox-demo
// │   └── myExcel.xlsx
// |   └── my_sample_schema.js
// |   └── example-helper.js
// |   └── simple-xls-toolbox  <--- executable here
// └── ...
// then in `my_sample_schema.js`, the import would be:
// import { generateStringCombinations } from "./example-helper.js";
// Adjust the path as necessary.

// define possible food combinations, to be used in the schema
const foodCombinations = generateStringCombinations(["Salad", "Fries", "Soda"]);

const schema = z.object({
  "Levels": z.number(),
  "Description": z.string().min(3),
  "HaveYouEver": z.enum(["Yes", "No"]),
  Colors: z.enum(["red", "green", "blue"]),
  Drinks: z.string()
    .refine((val) => {
      // multiple drinks separated by commas, but no literal value is expected
      try {
        return val.split(",").every((s) => s.trim().length);
      } catch (error) {
        console.error(error);
        return false;
      }
    }, {
      error: "Each 'drink' must be a non-empty string",
    }),
  "Col with\nLineBreak": z.string().min(2),
  FoodOrder: z.string().refine(
    (val) =>
      foodCombinations.includes(
        // user may add spaces before/after commas (or not)
        val.split(",").map((s) => s.trim()).join(","),
      ),
    { error: "Invalid food order combination" },
  ).optional(),
});

// export the schema as default
export default schema;
