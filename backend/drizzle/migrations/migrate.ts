import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";



const doMigrate = async () => {
    try {
        const connectionString = "postgres://postgres:Micahsim00**@localhost:5432/credential_provider"
        const credentialProviderPG = postgres(connectionString, { max: 1 })
        const db = drizzle(credentialProviderPG);

        await migrate(db, {
            migrationsFolder: "drizzle",
        }); 
        return console.log("Migration successful!");
    } catch (e) {
        return console.log("Migration error: ", e);
    }
};

doMigrate();