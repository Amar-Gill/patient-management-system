<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: 'Patients',
    icon: 'i-lucide-users',
    to: '/patients',
  },
  {
    label: 'New Patient',
    icon: 'i-lucide-user-plus',
    to: '/new-patient',
  },
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
