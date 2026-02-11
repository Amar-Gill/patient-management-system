import { db, schema } from 'hub:db'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const patientUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  middleName: z.string().optional().nullable(),
  dateOfBirth: z
    .string()
    .or(z.date())
    .transform((val) => {
      return val instanceof Date ? val : new Date(val)
    })
    .optional(),
  address: z.string().min(1, 'Address is required').optional(),
  status: z.enum(['inquiry', 'onboarding', 'active', 'churned']).optional(),
})

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid patient ID',
    })
  }

  const body = await readValidatedBody(event, data =>
    patientUpdateSchema.parse(data),
  )

  // Check if patient exists
  const [existingPatient] = await db
    .select()
    .from(schema.patients)
    .where(eq(schema.patients.id, Number(id)))

  if (!existingPatient) {
    throw createError({
      statusCode: 404,
      message: 'Patient not found',
    })
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {
    updatedAt: sql`(strftime('%s','now'))`,
  }

  if (body.firstName !== undefined) updateData.firstName = body.firstName
  if (body.lastName !== undefined) updateData.lastName = body.lastName
  if (body.middleName !== undefined) updateData.middleName = body.middleName
  if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth
  if (body.address !== undefined) updateData.address = body.address
  if (body.status !== undefined) updateData.status = body.status

  const [updatedPatient] = await db
    .update(schema.patients)
    .set(updateData)
    .where(eq(schema.patients.id, Number(id)))
    .returning()

  return updatedPatient
})
