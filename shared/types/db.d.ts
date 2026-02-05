import type { schema } from 'hub:db'

export type Patient = typeof schema.patients.$inferSelect
