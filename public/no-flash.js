const stored = localStorage.getItem('earnings-counter:theme')
const theme = stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system'
const resolvedTheme =
  theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : theme

document.documentElement.classList.add(resolvedTheme)
