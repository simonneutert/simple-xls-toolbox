import { z } from "zod";
import { generateStringCombinations } from "../../src/helpers/string-combinations.ts";

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

export default schema;
