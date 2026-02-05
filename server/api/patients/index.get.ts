import { db, schema } from 'hub:db'
import { asc } from 'drizzle-orm'

export default eventHandler(async () => {
  return db
    .select()
    .from(schema.patients)
    .orderBy(asc(schema.patients.createdAt))
})
