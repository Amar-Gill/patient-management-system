import { db, schema } from 'hub:db'
import { z } from 'zod'

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z
    .string()
    .or(z.date())
    .transform((val) => {
      return val instanceof Date ? val : new Date(val)
    }),
  address: z.string().min(1, 'Address is required'),
  status: z
    .enum(['inquiry', 'onboarding', 'active', 'churned'])
    .default('inquiry'),
})

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, data =>
    patientSchema.parse(data),
  )

  console.log('Creating patient:', body)

  const [newPatient] = await db
    .insert(schema.patients)
    .values({
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      status: body.status,
    })
    .returning()

  return newPatient
})
