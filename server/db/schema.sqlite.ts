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

export const patientAddresses = sqliteTable('patient_addresses', {
  id: integer().primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text().notNull(),
  state: text().notNull(),
  zipCode: text('zip_code').notNull(),
  country: text().notNull().default('USA'),
  addressType: text('address_type')
    .notNull()
    .$type<'home' | 'work' | 'billing' | 'other'>()
    .default('home'),
  isPrimary: integer('is_primary', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
})
