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
          class="max-w-2xl mx-auto"
          variant="subtle"
        >
          <p class="text-center">
            Use the navigation menu to access different sections of the
            dashboard.
          </p>
        </UPageCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
