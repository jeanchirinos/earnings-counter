import { describe, it, expect } from 'vitest'
import { resolveEffectiveTheme } from '@/utils/theme'

describe('resolveEffectiveTheme', () => {
  it("returns 'dark' when theme is 'dark' regardless of OS preference", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'dark', prefersDark: false })

    expect(resolvedTheme).toBe('dark')
  })

  it("returns 'dark' when theme is 'dark' and OS prefers dark", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'dark', prefersDark: true })

    expect(resolvedTheme).toBe('dark')
  })

  it("returns 'light' when theme is 'light' regardless of OS preference", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'light', prefersDark: true })

    expect(resolvedTheme).toBe('light')
  })

  it("returns 'light' when theme is 'light' and OS prefers light", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'light', prefersDark: false })

    expect(resolvedTheme).toBe('light')
  })

  it("returns 'dark' when theme is 'system' and OS prefers dark", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'system', prefersDark: true })

    expect(resolvedTheme).toBe('dark')
  })

  it("returns 'light' when theme is 'system' and OS prefers light", () => {
    const resolvedTheme = resolveEffectiveTheme({ theme: 'system', prefersDark: false })

    expect(resolvedTheme).toBe('light')
  })
})
