import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { users } from "./schema/users.schema";
import postgres from "postgres";


const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider"
const credentialProviderPG = postgres(connectionString, { max: 1 })
const db = drizzle(credentialProviderPG);

export default db;


// import pg from "pg";

// const { Pool } = pg;

// let localPoolConfig = {
//     user: "postgres",
//     host: "localhost",
//     database: "students",
//     password: "Micahsim00**",
//     port: 5432,
// };

// const poolConfig = process.env.DATABASE_URL ? {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// } : localPoolConfig;

// const pool = new Pool(poolConfig);

// export default pool;