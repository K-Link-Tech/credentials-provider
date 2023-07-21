import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { user } from "./schema/user.schema";
import postgres from "postgres";
 
const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider"
const credentialProviderPG = postgres(connectionString, { max: 1 })
const db = drizzle(credentialProviderPG);
 
migrate(db, { migrationsFolder: "drizzle" });

console.log(db.select().from(user));

