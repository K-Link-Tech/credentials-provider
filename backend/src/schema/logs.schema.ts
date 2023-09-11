import { users } from './users.schema';
import { pgTable, uuid, json, time } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade', 
      onUpdate: 'cascade'
    }),
  taskDetail: json('task_detail').notNull(),
  createdAt: time('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: time('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});
