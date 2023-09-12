import { users } from './users.schema';
import { pgTable, uuid, json, time, timestamp } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade', 
      onUpdate: 'cascade'
    }),
  taskDetail: json('task_detail').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull()
});
