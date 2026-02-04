import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
  dateOfBirth: integer('date_of_birth').notNull(),
  address: text().notNull(),
  status: text().notNull().default('inquiry'), // todo: make this an enum
})
