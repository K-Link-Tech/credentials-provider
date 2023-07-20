import type { Config } from "drizzle-kit";
 
export default {
  schema: "./src/modules/authentication/schema",
  out: "./drizzle/migrations",
} satisfies Config;