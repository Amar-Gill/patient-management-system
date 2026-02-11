<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

const route = useRoute()
const patientId = route.params.id as string

const {
  data: patient,
  status: fetchStatus,
  error: fetchError,
  refresh,
} = useFetch<Patient>(`/api/patients/${patientId}`)

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
  dateOfBirth: undefined,
  address: '',
  status: 'inquiry',
})

// Populate form when patient data is loaded
watch(
  patient,
  (newPatient) => {
    if (newPatient) {
      state.firstName = newPatient.firstName
      state.lastName = newPatient.lastName
      state.middleName = newPatient.middleName || ''
      state.address = newPatient.address
      state.status = newPatient.status

      // Convert date to CalendarDate for the date picker
      const dob = new Date(newPatient.dateOfBirth)
      state.dateOfBirth = new CalendarDate(
        dob.getFullYear(),
        dob.getMonth() + 1,
        dob.getDate(),
      )
    }
  },
  { immediate: true },
)

const toast = useToast()
const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    const updatedPatient = await $fetch(`/api/patients/${patientId}`, {
      method: 'PATCH',
      body: event.data,
      onResponseError({ response }) {
        toast.add({
          icon: 'mdi-alert-circle',
          title: 'Error',
          description: `Failed to update patient: ${response._data.message || response.statusText}`,
          color: 'error',
        })
      },
    })

    if (!updatedPatient) {
      return
    }

    toast.add({
      icon: 'mdi-check-circle',
      title: 'Patient Updated',
      description: `Patient ${event.data.firstName} ${event.data.lastName} has been updated successfully.`,
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

    // Refresh the patient data
    await refresh()
  }
  finally {
    isSubmitting.value = false
  }
}

const inputDate = useTemplateRef('inputDate')

// Computed properties for display
const patientFullName = computed(() => {
  if (!patient.value) return 'Loading...'
  const middle = patient.value.middleName
    ? ` ${patient.value.middleName} `
    : ' '
  return `${patient.value.firstName}${middle}${patient.value.lastName}`
})

const registeredAt = computed(() => {
  if (!patient.value) return ''
  return new Date(patient.value.createdAt).toLocaleDateString()
})

const lastUpdatedAt = computed(() => {
  if (!patient.value) return ''
  return new Date(patient.value.updatedAt).toLocaleDateString()
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="`Patient Details - ${patientFullName}`">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/patients"
            aria-label="Back to patients"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UContainer>
        <!-- Loading state -->
        <div
          v-if="fetchStatus === 'pending'"
          class="flex items-center justify-center py-12"
        >
          <div class="text-center">
            <UButton
              loading
              disabled
              variant="ghost"
              size="xl"
            />
            <p class="mt-2 text-muted">
              Loading patient details...
            </p>
          </div>
        </div>

        <!-- Error state -->
        <UPageCard
          v-else-if="fetchError"
          title="Error Loading Patient"
          description="Unable to load patient details."
          icon="mdi-alert-circle"
          class="max-w-md mx-auto"
          variant="subtle"
        >
          <div class="text-center space-y-4">
            <p class="text-error">
              {{
                fetchError.data?.message
                  || "Patient not found or an error occurred."
              }}
            </p>
            <div class="flex gap-2 justify-center">
              <UButton
                label="Retry"
                icon="i-lucide-refresh-cw"
                variant="subtle"
                @click="() => refresh()"
              />
              <UButton
                label="Back to Patients"
                icon="i-lucide-arrow-left"
                variant="outline"
                to="/patients"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Patient details form -->
        <UPageCard
          v-else-if="patient"
          title="Edit Patient"
          description="Update the patient's details below."
          icon="mdi-account-edit"
          class="max-w-md mx-auto"
          variant="subtle"
        >
          <template #description>
            <div class="flex justify-between items-center w-full">
              <div>
                <p class="text-sm">
                  Update the patient's details below.
                </p>
              </div>
              <div class="text-sm text-right">
                <p>Registered: {{ registeredAt }}</p>
                <p>Last Updated: {{ lastUpdatedAt }}</p>
              </div>
            </div>
          </template>

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
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Middle Name"
              name="middleName"
            >
              <UInput
                v-model="state.middleName"
                placeholder="William"
                class="w-full"
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
                class="w-full"
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
                class="w-full"
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

            <div class="flex gap-2 pt-4 w-full justify-center">
              <UButton
                label="Cancel"
                icon="i-lucide-x"
                variant="outline"
                color="neutral"
                to="/patients"
              />
              <UButton
                :loading="isSubmitting"
                type="submit"
                icon="i-lucide-save"
              >
                Save Changes
              </UButton>
            </div>
          </UForm>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
