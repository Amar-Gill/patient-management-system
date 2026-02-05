<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

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
    })
    .transform((value) => {
      if (value instanceof CalendarDate) {
        const jsDate = new Date(value.year, value.month - 1, value.day)
        return jsDate.toISOString().split('T')[0]
      }
      return value
    }),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
  status: z.enum(['inquiry', 'onboarding', 'active', 'churned'], {
    error: () => ({ message: 'Please select a valid status' }),
  }),
})

type Schema = z.output<typeof schema>

const statusOptions: { label: string, value: Patient['status'] }[] = [
  { label: 'Inquiry', value: 'inquiry' },
  { label: 'Onboarding', value: 'onboarding' },
  { label: 'Active', value: 'active' },
  { label: 'Churned', value: 'churned' },
]

const state = reactive<Partial<Schema>>({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: new CalendarDate(new Date().getFullYear() - 20, 1, 1),
  address: '',
  status: 'inquiry',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const patient = await $fetch('/api/patients', {
    method: 'POST',
    body: event.data,
    onResponseError({ response }) {
      toast.add({
        icon: 'mdi-alert-circle',
        title: 'Error',
        description: `Failed to create patient: ${response._data.message || response.statusText}`,
        color: 'error',
      })
    },
  })

  if (!patient) {
    return
  }

  toast.add({
    icon: 'mdi-check-circle',
    title: 'Patient Created',
    description: `Patient ${event.data.firstName} ${event.data.lastName} has been created successfully.`,
    actions: [
      {
        icon: 'mdi-account-multiple',
        label: 'View Patients',
        color: 'neutral',
        variant: 'outline',
        onClick: () => {
          navigateTo('/patients')
        },
      },
    ],
    color: 'success',
  })

  // Reset form state
  state.firstName = ''
  state.lastName = ''
  state.middleName = ''
  state.dateOfBirth = new CalendarDate(new Date().getFullYear() - 20, 1, 1)
  state.address = ''
  state.status = 'inquiry'
}

const inputDate = useTemplateRef('inputDate')
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
          variant="subtle"
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
              <UInputDate
                ref="inputDate"
                v-model="state.dateOfBirth"
              >
                <template #trailing>
                  <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-calendar"
                      aria-label="Select a date"
                      class="px-0"
                    />

                    <template #content>
                      <UCalendar
                        v-model="state.dateOfBirth"
                        class="p-2"
                      />
                    </template>
                  </UPopover>
                </template>
              </UInputDate>
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

            <UFormField
              label="Patient Status"
              name="status"
              required
            >
              <USelect
                v-model="state.status"
                :items="statusOptions"
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
