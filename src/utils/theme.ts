import type { Theme } from '@/types'

export function resolveEffectiveTheme({
  theme,
  prefersDark,
}: {
  theme: Theme
  prefersDark: boolean
}): 'dark' | 'light' {
  if (theme === 'dark') return 'dark'
  if (theme === 'light') return 'light'

  const resolvedTheme = prefersDark ? 'dark' : 'light'

  return resolvedTheme
}
