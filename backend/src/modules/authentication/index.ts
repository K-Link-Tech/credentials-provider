import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
 
const connectionString = "postgres://postgres:Micahsim00@localhost3000/credential_provider"
const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql);
 
await migrate(db, { migrationsFolder: "drizzle" });
