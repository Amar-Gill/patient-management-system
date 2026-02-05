<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>
    <template #body>
      <UContainer>
        <UPageCard
          title="Welcome to the Dashboard"
          description="Here you can manage your application."
          icon="mdi-view-dashboard"
          class="w-full"
          variant="naked"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <UPageCard
            title="View Patients"
            description="Manage your patient records."
            icon="mdi-account-multiple"
            variant="subtle"
            to="/patients"
          />
          <UPageCard
            title="Register New Patient"
            description="Add a new patient to the system."
            icon="mdi-account-plus"
            variant="subtle"
            to="/patients/new"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
