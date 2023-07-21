import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const doMigrate = async () => {
    try {
        // replace this with production server connection string in future
        const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider"
        const credentialProviderPG = postgres(connectionString, { max: 1 })
        const db = drizzle(credentialProviderPG);

        await migrate(db, {
            migrationsFolder: "drizzle/migrations",
        }); 
        console.log("Migration successful!");
        return process.exit(1);
    } catch (e) {
        console.log("Migration error: ", e);
        return process.exit(0);
    }
};

doMigrate();