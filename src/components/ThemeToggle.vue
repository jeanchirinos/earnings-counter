<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/types'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
]

function toggleDropdown(): void {
  isOpen.value = !isOpen.value
}

function selectTheme(selectedTheme: Theme): void {
  themeStore.setTheme(selectedTheme)

  isOpen.value = false
}

function handleOutsideClick(mouseEvent: MouseEvent): void {
  const clickedOutside =
    dropdownRef.value !== null && !dropdownRef.value.contains(mouseEvent.target as Node)

  if (clickedOutside) isOpen.value = false
}

function handleKeydown(keyboardEvent: KeyboardEvent): void {
  if (keyboardEvent.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-fit">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-label="Theme"
      class="inline-flex items-center justify-between gap-1.5 w-[135px] bg-bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-cream-muted hover:text-gold hover:border-gold transition-colors cursor-pointer focus:outline-none focus:border-gold"
      @click="toggleDropdown"
    >
      <!-- Moon icon — dark -->
      <svg
        v-if="theme === 'dark'"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      <!-- Sun icon — light -->
      <svg
        v-else-if="theme === 'light'"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </svg>

      <!-- Monitor icon — system -->
      <svg
        v-else
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>

      <span>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }}</span>

      <!-- Chevron -->
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <ul
      v-if="isOpen"
      role="listbox"
      class="absolute right-0 mt-1 w-full bg-bg-surface border border-border rounded overflow-hidden z-50 animate-slide-down"
    >
      <li
        v-for="option in THEME_OPTIONS"
        :key="option.value"
        role="option"
        :aria-selected="theme === option.value"
        class="flex items-center gap-1.5 px-2 py-1.5 text-xs font-mono cursor-pointer transition-colors"
        :class="
          theme === option.value ? 'text-gold' : 'text-cream-muted hover:text-cream hover:bg-border'
        "
        @click="selectTheme(option.value)"
      >
        <!-- Moon -->
        <svg
          v-if="option.value === 'dark'"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        <!-- Sun -->
        <svg
          v-else-if="option.value === 'light'"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          />
        </svg>

        <!-- Monitor -->
        <svg
          v-else
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>

        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
