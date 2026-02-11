import { db } from 'hub:db'
import { patients, patientAddresses } from '../../db/schema.sqlite'
import { z } from 'zod'

const addressSchema = z.object({
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('USA'),
  addressType: z.enum(['home', 'work', 'billing', 'other']).default('home'),
})

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
  address: addressSchema,
  secondaryAddress: addressSchema.optional(),
  status: z
    .enum(['inquiry', 'onboarding', 'active', 'churned'])
    .default('inquiry'),
})

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, data =>
    patientSchema.parse(data),
  )

  console.log('Creating patient:', body)

  // Format the address as a string for the patients table (for backward compatibility)
  const addressString = [
    body.address.addressLine1,
    body.address.addressLine2,
    body.address.city,
    body.address.state,
    body.address.zipCode,
    body.address.country,
  ].filter(Boolean).join(', ')

  // Use a transaction to ensure both patient and address are created atomically
  const result = await db.transaction(async (tx) => {
    // Insert the patient
    const [newPatient] = await tx
      .insert(patients)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName || null,
        dateOfBirth: body.dateOfBirth,
        address: addressString,
        status: body.status,
      })
      .returning()

    if (!newPatient) {
      throw new Error('Failed to create patient')
    }

    // Insert the primary address into the patient_addresses table
    await tx
      .insert(patientAddresses)
      .values({
        patientId: newPatient.id,
        addressLine1: body.address.addressLine1,
        addressLine2: body.address.addressLine2 || null,
        city: body.address.city,
        state: body.address.state,
        zipCode: body.address.zipCode,
        country: body.address.country,
        addressType: body.address.addressType,
        isPrimary: true, // First address is the primary address
      })

    // Insert the secondary address if provided
    if (body.secondaryAddress) {
      await tx
        .insert(patientAddresses)
        .values({
          patientId: newPatient.id,
          addressLine1: body.secondaryAddress.addressLine1,
          addressLine2: body.secondaryAddress.addressLine2 || null,
          city: body.secondaryAddress.city,
          state: body.secondaryAddress.state,
          zipCode: body.secondaryAddress.zipCode,
          country: body.secondaryAddress.country,
          addressType: body.secondaryAddress.addressType,
          isPrimary: false,
        })
    }

    return newPatient
  })

  return result
})
