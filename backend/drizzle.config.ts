import type { Config } from "drizzle-kit";
 
const connectionSecureString = "postgres://postgres:Micahsim00@localhost3000/credential_provider";

export default {
  schema: "./src/modules/authentication/schema",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionSecureString,
  }
} satisfies Config;