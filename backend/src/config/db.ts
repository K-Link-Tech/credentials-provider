import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "./config";

const connectionString = `postgres://${config.drizzle.user}:${config.drizzle.pass}@${config.drizzle.host}:${config.server.port}/${config.drizzle.database}` || "postgres://postgres:Micahsim00**@localhost:5432/credential_provider";
const credentialProviderPG = postgres(connectionString, { max: 1 });
const db: PostgresJsDatabase = drizzle(credentialProviderPG);

export default db;
