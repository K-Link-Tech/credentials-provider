import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, time, pgEnum } from 'drizzle-orm/pg-core';
import { environments } from './environments.schema';

export const scopeEnum = pgEnum(
  'scopes', 
  ['admin', 'user']
);

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name')
    .notNull()
    .unique(),
  url: text('url').notNull(),
  scope: scopeEnum('scope').notNull(),
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