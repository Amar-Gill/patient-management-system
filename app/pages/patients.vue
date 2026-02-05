<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const { data: patients, status, error } = useFetch<Patient[]>('/api/patients')

const statusOptions = ref<Patient['status'][]>([
  'active',
  'onboarding',
  'churned',
  'inquiry',
])

const table = useTemplateRef('table')

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<Patient>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'middleName', header: 'Middle Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of Birth',
    cell: ({ row }) => formatDate(row.original.dateOfBirth),
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
    header: 'Registered At',
    cell: ({ row }) => formatDate(row.original.createdAt),
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
                  ?.getColumn('lastName')
                  ?.getFilterValue() as string
              "
              class="max-w-sm"
              placeholder="Filter lastName..."
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
          />
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
