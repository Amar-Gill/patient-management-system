import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const messages = sqliteTable('messages', {
  id: integer().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  createdAt: integer('created_at').notNull(),
})

export const patients = sqliteTable('patients', {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  middleName: text('middle_name'),
  dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }).notNull(),
  address: text().notNull(),
  status: text()
    .notNull()
    .$type<'inquiry' | 'onboarding' | 'active' | 'churned'>()
    .default('inquiry'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
})
