import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  createdAt: integer('created_at', { mode: 'timestamp' })
});

export const emails = sqliteTable('emails', {
  id: text('id').primaryKey(),
  gmailId: text('gmail_id').notNull(),
  userId: text('user_id').references(() => users.id),
  bucket: text('bucket').default('inbox'),
  subject: text('subject'),
  sender: text('sender'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false)
});