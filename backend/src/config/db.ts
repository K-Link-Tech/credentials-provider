import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from './config';
import * as schema from '../schema';

const connectionString =
  `postgres://${config.drizzle.user}:${config.drizzle.pass}@${config.drizzle.host}:${config.server.port}/${config.drizzle.database}` ||
  'postgres://postgres:Micahsim00**@localhost:5432/credential_provider';
const credentialProviderPG = postgres(connectionString, { max: 1 });
const db = drizzle(credentialProviderPG, {
  schema,
});

export default db;
