import { ZodObject } from "zod";

export async function loadSchema(sheetPath: string): Promise<ZodObject> {
  if (!sheetPath || !sheetPath.endsWith(".js")) {
    console.warn(
      "No valid schema provided, using default schema for demonstration.",
    );
    Deno.exit(1);
  }

  const imported = await import(
    new URL(sheetPath, `file://${Deno.cwd()}/`).href
  );
  const schema = imported.default || imported.schema;
  if (!schema) throw new Error("No schema exported from JS file");
  return schema;
}
