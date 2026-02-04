<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Patients" />
    </template>
    <template #body>
      <UContainer>
        <UPageCard
          title="Patients"
          description="Manage your patients here."
          icon="mdi-account-multiple"
          class="max-w-4xl mx-auto"
          variant="subtle"
        >
          <p class="text-center">
            Here you can view, add, and manage your patients.
          </p>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
