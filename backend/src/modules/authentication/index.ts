import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { users } from "./schema/users.schema";
import { express } from "express";
import postgres from "postgres";
 
const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider"
const credentialProviderPG = postgres(connectionString, { max: 1 })
const db = drizzle(credentialProviderPG);



