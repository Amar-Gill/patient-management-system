<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

const addressSchema = z.object({
  addressLine1: z
    .string()
    .min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(1, 'City is required'),
  state: z
    .string()
    .min(1, 'State is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: z.string().default('USA'),
  addressType: z.enum(['home', 'work', 'billing', 'other']).default('home'),
})

const optionalAddressSchema = z.object({
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: z.string().default('USA'),
  addressType: z.enum(['home', 'work', 'billing', 'other']).default('work'),
}).optional()

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
  address: addressSchema,
  secondaryAddress: optionalAddressSchema,
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

const addressTypeOptions: { label: string, value: 'home' | 'work' | 'billing' | 'other' }[] = [
  { label: 'Home', value: 'home' },
  { label: 'Work', value: 'work' },
  { label: 'Billing', value: 'billing' },
  { label: 'Other', value: 'other' },
]

const showSecondaryAddress = ref(false)

const state = reactive<Partial<Schema>>({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: new CalendarDate(new Date().getFullYear() - 20, 1, 1),
  address: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    addressType: 'home',
  },
  secondaryAddress: undefined,
  status: 'inquiry',
})

function toggleSecondaryAddress() {
  showSecondaryAddress.value = !showSecondaryAddress.value
  if (showSecondaryAddress.value) {
    state.secondaryAddress = {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      addressType: 'work',
    }
  }
  else {
    state.secondaryAddress = undefined
  }
}

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
  state.address = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    addressType: 'home',
  }
  state.secondaryAddress = undefined
  showSecondaryAddress.value = false
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
          class="max-w-md mx-auto"
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

            <fieldset class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <legend class="text-sm font-medium px-2">
                Primary Address
              </legend>

              <UFormField
                label="Address Line 1"
                name="address.addressLine1"
                required
              >
                <UInput
                  v-model="state.address!.addressLine1"
                  placeholder="123 Main Street"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Address Line 2"
                name="address.addressLine2"
              >
                <UInput
                  v-model="state.address!.addressLine2"
                  placeholder="Apt 4B"
                  class="w-full"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="City"
                  name="address.city"
                  required
                >
                  <UInput
                    v-model="state.address!.city"
                    placeholder="New York"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="State"
                  name="address.state"
                  required
                >
                  <UInput
                    v-model="state.address!.state"
                    placeholder="NY"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="ZIP Code"
                  name="address.zipCode"
                  required
                >
                  <UInput
                    v-model="state.address!.zipCode"
                    placeholder="10001"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Country"
                  name="address.country"
                >
                  <UInput
                    v-model="state.address!.country"
                    placeholder="USA"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Address Type"
                name="address.addressType"
              >
                <USelect
                  v-model="state.address!.addressType"
                  :items="addressTypeOptions"
                />
              </UFormField>
            </fieldset>

            <div class="flex justify-center">
              <UButton
                type="button"
                variant="ghost"
                :icon="showSecondaryAddress ? 'i-lucide-minus' : 'i-lucide-plus'"
                @click="toggleSecondaryAddress"
              >
                {{ showSecondaryAddress ? 'Remove Secondary Address' : 'Add Secondary Address' }}
              </UButton>
            </div>

            <fieldset
              v-if="showSecondaryAddress"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
            >
              <legend class="text-sm font-medium px-2">
                Secondary Address
              </legend>

              <UFormField
                label="Address Line 1"
                name="secondaryAddress.addressLine1"
                required
              >
                <UInput
                  v-model="state.secondaryAddress!.addressLine1"
                  placeholder="456 Oak Avenue"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Address Line 2"
                name="secondaryAddress.addressLine2"
              >
                <UInput
                  v-model="state.secondaryAddress!.addressLine2"
                  placeholder="Suite 100"
                  class="w-full"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="City"
                  name="secondaryAddress.city"
                  required
                >
                  <UInput
                    v-model="state.secondaryAddress!.city"
                    placeholder="Los Angeles"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="State"
                  name="secondaryAddress.state"
                  required
                >
                  <UInput
                    v-model="state.secondaryAddress!.state"
                    placeholder="CA"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="ZIP Code"
                  name="secondaryAddress.zipCode"
                  required
                >
                  <UInput
                    v-model="state.secondaryAddress!.zipCode"
                    placeholder="90001"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Country"
                  name="secondaryAddress.country"
                >
                  <UInput
                    v-model="state.secondaryAddress!.country"
                    placeholder="USA"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Address Type"
                name="secondaryAddress.addressType"
              >
                <USelect
                  v-model="state.secondaryAddress!.addressType"
                  :items="addressTypeOptions"
                />
              </UFormField>
            </fieldset>

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
                loading-auto
                type="submit"
                icon="i-lucide-user-plus"
              >
                Submit
              </UButton>
            </div>
          </UForm>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
