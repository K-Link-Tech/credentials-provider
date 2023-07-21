// import { migrate } from "drizzle-orm/node-postgres/migrator";
// import { index } from "./index";

// // this will automatically run needed migrations on the database
// migrate(index, { migrationsFolder: "./drizzle/migrations" })
//   .then(() => {
//     console.log("Migrations complete!");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error("Migrations failed!", err);
//     process.exit(1);
//   });