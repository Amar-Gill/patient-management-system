<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  dateOfBirth: z
    .any()
    .refine(value => value !== null && value !== undefined, {
      message: 'Date of birth is required',
    }),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: undefined,
  address: '',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Form submitted with data:', event.data)
  toast.add({
    icon: 'mdi-check-circle',
    title: 'Patient Created',
    description: `Patient ${event.data.firstName} ${event.data.lastName} has been created successfully.`,
  })

  // Reset form state
  state.firstName = ''
  state.lastName = ''
  state.middleName = ''
  state.dateOfBirth = undefined
  state.address = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="New Patient Registration" />
    </template>
    <template #body>
      <UContainer>
        <UPageCard
          title="New Patient"
          description="Enter the patient's details below."
          icon="mdi-account-plus"
          class="max-w-xl mx-auto"
        >
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              label="First Name"
              name="firstName"
              required
            >
              <UInput
                v-model="state.firstName"
                placeholder="John"
              />
            </UFormField>

            <UFormField
              label="Middle Name"
              name="middleName"
            >
              <UInput
                v-model="state.middleName"
                placeholder="William"
              />
            </UFormField>

            <UFormField
              label="Last Name"
              name="lastName"
              required
            >
              <UInput
                v-model="state.lastName"
                placeholder="Doe"
              />
            </UFormField>

            <UFormField
              label="Date of Birth"
              name="dateOfBirth"
              required
            >
              <UInputDate v-model="state.dateOfBirth" />
            </UFormField>

            <UFormField
              label="Address"
              name="address"
              required
            >
              <UTextarea
                v-model="state.address"
                placeholder="123 Main Street, Apt 4B, New York, NY 10001"
                :rows="3"
              />
            </UFormField>

            <div class="flex gap-2 pt-4">
              <UButton type="submit">
                Submit
              </UButton>
            </div>
          </UForm>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
