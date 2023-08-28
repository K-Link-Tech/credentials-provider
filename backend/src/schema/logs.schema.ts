import { users } from "./users.schema";
import { serial, text, timestamp, pgTable, uuid, json } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    taskDetail: json("task_detail").notNull()
});
