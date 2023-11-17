import type { Config } from "drizzle-kit";
 
import dotenv from 'dotenv';
import config from './config';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionSecureString = `postgres://${config.drizzle.user}:${config.drizzle.pass}@${config.drizzle.host}:${config.server.port}/${config.drizzle.database}`;

console.log("connection string:", connectionSecureString);

export default {
  schema: "./src/schema",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionSecureString,
  },
  strict: true
} satisfies Config;