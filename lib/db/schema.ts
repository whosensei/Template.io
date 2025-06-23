import { pgTable, text, timestamp, uuid, json, boolean, unique } from 'drizzle-orm/pg-core'

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  variables: json('variables').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const gmailConnections = pgTable('gmail_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  email: text('email').notNull(),
  refreshToken: text('refresh_token').notNull(),
  accessToken: text('access_token'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    userEmailUnique: unique().on(table.userId, table.email),
  }
})

export const emailHistory = pgTable('email_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  templateId: uuid('template_id').references(() => templates.id),
  gmailConnectionId: uuid('gmail_connection_id').references(() => gmailConnections.id),
  to: json('to').notNull(), // Array of email addresses
  cc: json('cc').default([]), // Array of email addresses
  bcc: json('bcc').default([]), // Array of email addresses
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('sent'), // sent, failed, pending
  messageId: text('message_id'), // Gmail message ID
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at').notNull().defaultNow(),
})

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(),
  highlightColor: text('highlight_color').notNull().default('blue'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert
export type GmailConnection = typeof gmailConnections.$inferSelect
export type NewGmailConnection = typeof gmailConnections.$inferInsert
export type EmailHistory = typeof emailHistory.$inferSelect
export type NewEmailHistory = typeof emailHistory.$inferInsert
export type UserPreferences = typeof userPreferences.$inferSelect
export type NewUserPreferences = typeof userPreferences.$inferInsert 