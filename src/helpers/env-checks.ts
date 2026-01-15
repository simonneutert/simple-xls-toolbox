export function isEnvTest(): boolean {
  return Deno.env.get("NODE_ENV") === "test";
}
