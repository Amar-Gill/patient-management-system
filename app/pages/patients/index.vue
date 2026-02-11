<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const {
  data: patients,
  status,
  error,
  refresh,
} = useFetch<Patient[]>('/api/patients')

const statusOptions = ref<Patient['status'][]>([
  'active',
  'onboarding',
  'churned',
  'inquiry',
])

const table = useTemplateRef('table')

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Patient>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'First Name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'middleName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Middle Name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },

    cell: ({ row }) => row.original.middleName || '---',
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Last Name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'dateOfBirth',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Age',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },

    cell: ({ row }) => {
      const dob = new Date(row.original.dateOfBirth)
      const ageDifMs = Date.now() - dob.getTime()
      const ageDate = new Date(ageDifMs)
      return Math.abs(ageDate.getUTCFullYear() - 1970)
    },
  },
  { accessorKey: 'address', header: 'Address' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        active: 'success' as const,
        onboarding: 'info' as const,
        churned: 'warning' as const,
        inquiry: 'neutral' as const,
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status'),
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Registered At',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h(UButton, {
        color: 'neutral',
        variant: 'soft',
        size: 'sm',
        label: 'View / Edit',
        icon: 'i-lucide-pencil',
        to: `/patients/${row.original.id}`,
      })
    },
  },
]

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Patients" />
    </template>
    <template #body>
      <UContainer>
        <UPageCard variant="subtle">
          <div class="flex space-x-2 py-3.5 border-b border-accented">
            <UInput
              :model-value="
                table?.tableApi
                  ?.getColumn('firstName')
                  ?.getFilterValue() as string
              "
              class="max-w-sm"
              placeholder="Filter first name..."
              @update:model-value="
                table?.tableApi?.getColumn('firstName')?.setFilterValue($event)
              "
            />

            <UInput
              :model-value="
                table?.tableApi
                  ?.getColumn('middleName')
                  ?.getFilterValue() as string
              "
              class="max-w-sm"
              placeholder="Filter middle name..."
              @update:model-value="
                table?.tableApi?.getColumn('middleName')?.setFilterValue($event)
              "
            />

            <UInput
              :model-value="
                table?.tableApi
                  ?.getColumn('lastName')
                  ?.getFilterValue() as string
              "
              class="max-w-sm"
              placeholder="Filter last name..."
              @update:model-value="
                table?.tableApi?.getColumn('lastName')?.setFilterValue($event)
              "
            />

            <UInput
              :model-value="
                table?.tableApi
                  ?.getColumn('address')
                  ?.getFilterValue() as string
              "
              class="max-w-sm"
              placeholder="Filter address..."
              @update:model-value="
                table?.tableApi?.getColumn('address')?.setFilterValue($event)
              "
            />
            <USelectMenu
              :model-value="
                table?.tableApi
                  ?.getColumn('status')
                  ?.getFilterValue() as Patient['status']
              "
              class="max-w-sm"
              placeholder="Filter status..."
              clear
              :items="statusOptions"
              @update:model-value="
                table?.tableApi?.getColumn('status')?.setFilterValue($event)
              "
            />
          </div>
          <UTable
            ref="table"
            :data="patients"
            :columns="columns"
            :loading="status === 'pending'"
          >
            <template #empty>
              <div
                v-if="error"
                class="text-center text-sm text-muted"
              >
                Failed to load patients. Please try again later.
                <div class="mt-2">
                  <UButton
                    label="Retry"
                    icon="i-lucide-refresh-cw"
                    variant="subtle"
                    loading-auto
                    @click="refresh"
                  />
                </div>
              </div>
              <div
                v-else
                class="text-center text-sm text-muted"
              >
                No patients found with current filters.
                <div class="mt-2">
                  <UButton
                    label="Add Patient"
                    icon="i-lucide-user-plus"
                    to="/patients/new"
                    variant="subtle"
                  />
                </div>
              </div>
            </template>
          </UTable>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
