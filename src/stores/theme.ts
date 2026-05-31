import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/types'
import { useThemeStorage } from '@/composables/useThemeStorage'
import { resolveEffectiveTheme } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  const { saveTheme, loadTheme } = useThemeStorage()

  const theme = ref<Theme>('system')

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const resolvedTheme = computed(() =>
    resolveEffectiveTheme({ theme: theme.value, prefersDark: mediaQuery.matches }),
  )

  function applyResolvedTheme(): void {
    document.documentElement.classList.remove('dark', 'light')

    document.documentElement.classList.add(resolvedTheme.value)
  }

  function setTheme(value: Theme): void {
    theme.value = value

    saveTheme(value)

    applyResolvedTheme()
  }

  function loadFromStorage(): void {
    const storedTheme = loadTheme()

    theme.value = storedTheme

    applyResolvedTheme()
  }

  watch(theme, applyResolvedTheme)

  // Intentional: no removeEventListener — store is a global singleton for the app lifetime
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') applyResolvedTheme()
  })

  return { theme, resolvedTheme, setTheme, loadFromStorage }
})
