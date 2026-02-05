<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
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

const toast = useToast()

const user = {
  name: 'John Doe',
  picture: 'https://i.pravatar.cc/300',
}

const colorMode = useColorMode()
const userMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    type: 'label',
    label: user.name,
    avatar: {
      src: user.picture,
      alt: user.name,
    },
  },
  {
    label: 'Appearance',
    icon: 'i-lucide-sun-moon',
    children: [
      {
        label: 'Light',
        icon: 'i-lucide-sun',
        type: 'checkbox',
        checked: colorMode.value === 'light',
        onSelect(e: Event) {
          e.preventDefault()

          colorMode.preference = 'light'
        },
      },
      {
        label: 'Dark',
        icon: 'i-lucide-moon',
        type: 'checkbox',
        checked: colorMode.value === 'dark',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            colorMode.preference = 'dark'
          }
        },
        onSelect(e: Event) {
          e.preventDefault()
        },
      },
    ],
  },
  {
    label: 'Log out',
    icon: 'i-lucide-log-out',
    onSelect: () =>
      toast.add({
        title: 'Not implemented',
        description: 'This is just a demo, so logging out is not implemented.',
        color: 'warning',
      }),
  },
])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
      />
      <template #footer>
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            :name="user.name"
            :label="user.name"
            :avatar="{
              src: user.picture,
              alt: user.name,
            }"
            color="neutral"
            variant="ghost"
            block
            trailing-icon="i-lucide-chevrons-up-down"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
