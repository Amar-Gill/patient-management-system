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
    to: '/patients/new',
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
      <template #footer>
        <UColorModeSelect />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
