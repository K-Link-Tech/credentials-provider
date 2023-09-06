import { pgTable, uuid, text, time, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { environments } from './environments.schema';

export const encryptionEnum = pgEnum('encryptionAlgo', ['aes', 'rsa']);

// TODO: Question: Should we consider bit-length for encryption?

export const env_key_values = pgTable('env_key_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  value: text('value').notNull(),
  encryption_method: encryptionEnum('encryptionAlgo').notNull(),
  environment_id: uuid('environment_id')
    .notNull()
    .references(() => environments.id),
  createdAt: time('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: time('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const env_key_valuesRelations = relations(env_key_values, ({ one }) => ({
  environment: one(environments, {
    fields: [env_key_values.environment_id],
    references: [environments.id]
  })
}));
