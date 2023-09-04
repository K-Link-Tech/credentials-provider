import { users } from './users.schema';
import { pgTable, uuid, json, timestamp, time } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  taskDetail: json('task_detail').notNull(),
  createdAt: time('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: time('updated_at', { withTimezone: true }).defaultNow().notNull()
});
