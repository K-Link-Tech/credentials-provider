import { pgTable, uuid, text, time } from 'drizzle-orm/pg-core';
import { projects } from './projects.schema';
import { relations } from 'drizzle-orm';
import { env_key_values } from './env_key_values.schema';

export const environments = pgTable('environments', {
id: uuid('id').defaultRandom().primaryKey(),
  name: text('name')
    .notNull()
    .unique(),
  code: text('code').notNull(),
  key: text('key').notNull(),
  project_id: uuid('project_id')
    .notNull()
    .references(() => projects.id),
  createdAt: time('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: time('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const environmentsRelations = relations(environments, ({ one, many }) => ({
  project: one(projects, {
    fields: [environments.project_id],
    references: [projects.id]
  }),
  env_key_values: many(env_key_values)
}));