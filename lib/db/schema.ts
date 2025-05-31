import { pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core'

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  variables: json('variables').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert 