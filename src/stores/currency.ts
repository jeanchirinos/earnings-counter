import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Currency } from '@/types'
import { useCurrencyStorage } from '@/composables/useCurrencyStorage'

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', locale: 'es-PE' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', locale: 'es-CO' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', locale: 'es-AR' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', locale: 'en-CA' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', locale: 'en-AU' },
]

export const useCurrencyStore = defineStore('currency', () => {
  const { saveCurrency, loadCurrency } = useCurrencyStorage()
  const selectedCurrency = ref<Currency>(CURRENCIES[0])

  function setCurrency(code: string): void {
    const matchedCurrency = CURRENCIES.find((currency) => currency.code === code)
    if (!matchedCurrency) return

    selectedCurrency.value = matchedCurrency

    saveCurrency(code)
  }

  function loadFromStorage(): void {
    const storedCurrencyCode = loadCurrency()
    if (storedCurrencyCode) setCurrency(storedCurrencyCode)
  }

  return { selectedCurrency, setCurrency, loadFromStorage }
})
