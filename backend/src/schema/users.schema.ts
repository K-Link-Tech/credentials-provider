import { text, timestamp, pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum(
  'Roles', 
  ['admin', 'user']
);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: rolesEnum('role').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
