import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, time } from 'drizzle-orm/pg-core';
import { environments } from './environments.schema';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name')
    .notNull()
    .unique(),
  url: text('url').notNull(),
  createdAt: time('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: time('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const projectsRelations = relations(projects, ({ many }) => ({
  environments: many(environments)
}));