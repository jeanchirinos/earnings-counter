<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalaryStore } from '@/stores/salary'
import { useCurrencyStore, CURRENCIES } from '@/stores/currency'

const salaryStore = useSalaryStore()

const currencyStore = useCurrencyStore()
const { selectedCurrency } = storeToRefs(currencyStore)

const currencyDropdownRef = ref<HTMLDivElement | null>(null)
const isCurrencyDropdownOpen = ref(false)

function toggleCurrencyDropdown(): void {
  isCurrencyDropdownOpen.value = !isCurrencyDropdownOpen.value
}

function selectCurrency(code: string): void {
  currencyStore.setCurrency(code)
  isCurrencyDropdownOpen.value = false
}

function handleClickOutside(mouseEvent: MouseEvent): void {
  if (currencyDropdownRef.value && !currencyDropdownRef.value.contains(mouseEvent.target as Node)) {
    isCurrencyDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const isEditing = ref(false)
const error = ref('')

const hasSalary = computed(
  () => salaryStore.monthlySalary !== null && salaryStore.monthlySalary > 0,
)

const showForm = computed(() => !hasSalary.value || isEditing.value)

async function startEdit(): Promise<void> {
  inputValue.value = salaryStore.monthlySalary?.toString() ?? ''
  isEditing.value = true
  error.value = ''

  await nextTick()

  inputRef.value?.focus()
}

const MAX_SALARY = 1_000_000_000

watch(inputValue, (newInputValue, oldInputValue) => {
  const parsed = parseFloat(newInputValue)

  if (!isNaN(parsed) && parsed > MAX_SALARY) {
    inputValue.value = oldInputValue || ''
  }
})

function handleSubmit(): void {
  const value = parseFloat(inputValue.value)
  if (isNaN(value) || value <= 0) {
    error.value = 'Enter a valid amount greater than zero'
    return
  }

  salaryStore.setSalary(value)

  isEditing.value = false
  error.value = ''
  inputValue.value = ''
}

function handleKeydown(keyboardEvent: KeyboardEvent): void {
  if (keyboardEvent.key === 'Enter') handleSubmit()

  if (keyboardEvent.key === 'Escape' && isEditing.value) isEditing.value = false
}

const formattedSalary = computed(() => {
  if (!salaryStore.monthlySalary) return ''

  const formattedAmount = salaryStore.monthlySalary.toLocaleString(selectedCurrency.value.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formattedAmount
})
</script>

<template>
  <div class="border-t border-border pt-6 sm:pt-10">
    <div v-if="showForm" class="mx-auto max-w-[460px]">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-[0.58rem] tracking-[0.32em] text-cream-muted">MONTHLY SALARY</span>
        <div class="flex items-center gap-3">
          <div ref="currencyDropdownRef" class="relative">
            <button
              class="flex cursor-pointer items-center gap-1 font-mono text-[0.58rem] tracking-[0.2em] text-cream-muted transition-colors hover:text-cream focus:outline-none"
              @click="toggleCurrencyDropdown"
            >
              {{ selectedCurrency.code }}
              <span class="text-[0.45rem] opacity-50">▼</span>
            </button>
            <div
              v-if="isCurrencyDropdownOpen"
              class="absolute right-0 bottom-full mb-1.5 flex flex-col min-w-[200px] border border-border bg-bg-surface overflow-hidden"
            >
              <button
                v-for="currency in CURRENCIES"
                :key="currency.code"
                class="flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-[0.58rem] tracking-[0.2em] transition-colors cursor-pointer"
                :class="
                  currency.code === selectedCurrency.code
                    ? 'bg-gold text-bg'
                    : 'text-cream-muted hover:bg-gold hover:text-bg'
                "
                @click="selectCurrency(currency.code)"
              >
                <span>{{ currency.code }}</span>
                <span class="ml-4 truncate tracking-[0.05em] opacity-60">{{ currency.name }}</span>
              </button>
            </div>
          </div>
          <button
            v-if="isEditing"
            class="text-[0.58rem] tracking-[0.2em] text-cream-muted transition-colors hover:text-cream cursor-pointer"
            @click="isEditing = false"
          >
            CANCEL
          </button>
        </div>
      </div>

      <div
        class="flex items-stretch border border-border bg-bg-surface transition-colors focus-within:border-gold-dim"
      >
        <span
          class="flex select-none items-center border-r border-border px-3 py-3.5 font-mono text-[0.9rem] text-gold-dim sm:px-4"
        >
          {{ selectedCurrency.symbol }}
        </span>
        <input
          ref="inputRef"
          v-model="inputValue"
          type="number"
          min="0"
          max="1000000000"
          step="0.01"
          placeholder="0.00"
          class="w-[calc(15ch+1.5rem)] px-3 py-3.5 font-mono text-base tabular-nums text-cream placeholder:text-cream-muted placeholder:opacity-40 sm:w-[calc(15ch+2rem)] sm:px-4 sm:text-xl"
          @keydown="handleKeydown"
        />
        <button
          class="flex-1 whitespace-nowrap bg-gold px-3 py-3.5 font-medium font-mono text-[0.6rem] tracking-[0.15em] text-bg transition-colors hover:bg-gold-light sm:px-4 sm:tracking-[0.28em] cursor-pointer"
          @click="handleSubmit"
        >
          {{ isEditing ? 'UPDATE' : 'START' }}
        </button>
      </div>

      <p v-if="error" class="mt-2.5 text-[0.7rem] tracking-[0.06em] text-error">
        {{ error }}
      </p>
    </div>

    <div v-else class="mx-auto flex max-w-[460px] flex-col items-center gap-3 sm:flex-row sm:gap-5">
      <span class="shrink-0 text-[0.58rem] tracking-[0.32em] text-cream-muted">MONTHLY SALARY</span>
      <span
        class="flex-1 whitespace-nowrap text-center font-mono text-base tabular-nums text-cream sm:text-left"
        >{{ selectedCurrency.symbol }}{{ formattedSalary }}</span
      >
      <button
        class="shrink-0 border border-border px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.22em] text-cream-muted transition-colors hover:border-gold-dim hover:text-gold cursor-pointer"
        @click="startEdit"
      >
        EDIT
      </button>
    </div>
  </div>
</template>
