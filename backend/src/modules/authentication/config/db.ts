import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider";
const credentialProviderPG = postgres(connectionString, { max: 1 });
const db = drizzle(credentialProviderPG);

export default db;
