import type { Theme } from '@/types'

const STORAGE_KEY = 'earnings-counter:theme'

const VALID_THEMES: Theme[] = ['dark', 'light', 'system']

export function useThemeStorage() {
  function saveTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEY, theme)
  }

  function loadTheme(): Theme {
    const storedThemeString = localStorage.getItem(STORAGE_KEY)
    if (!storedThemeString) return 'system'

    const isValidTheme = (VALID_THEMES as string[]).includes(storedThemeString)
    const validatedTheme = isValidTheme ? (storedThemeString as Theme) : 'system'

    return validatedTheme
  }

  function clearTheme(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { saveTheme, loadTheme, clearTheme }
}
