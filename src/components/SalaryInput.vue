<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useSalaryStore } from '@/stores/salary'

const salaryStore = useSalaryStore()

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

  const formattedAmount = salaryStore.monthlySalary.toLocaleString('en-US', {
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
        <button
          v-if="isEditing"
          class="text-[0.58rem] tracking-[0.2em] text-cream-muted transition-colors hover:text-cream"
          @click="isEditing = false"
        >
          CANCEL
        </button>
      </div>

      <div
        class="flex items-stretch border border-border bg-bg-surface transition-colors focus-within:border-gold-dim"
      >
        <span
          class="flex select-none items-center border-r border-border px-3 py-3.5 font-mono text-[0.9rem] text-gold-dim sm:px-4"
        >
          $
        </span>
        <input
          ref="inputRef"
          v-model="inputValue"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="min-w-0 flex-1 px-3 py-3.5 font-mono text-base tabular-nums text-cream placeholder:text-cream-muted placeholder:opacity-40 sm:px-4 sm:text-xl"
          @keydown="handleKeydown"
        />
        <button
          class="shrink-0 whitespace-nowrap bg-gold px-3 py-3.5 font-medium font-mono text-[0.6rem] tracking-[0.15em] text-bg transition-colors hover:bg-gold-light sm:px-4 sm:tracking-[0.28em]"
          @click="handleSubmit"
        >
          {{ isEditing ? 'UPDATE' : 'START' }}
        </button>
      </div>

      <p v-if="error" class="mt-2.5 text-[0.7rem] tracking-[0.06em] text-error">
        {{ error }}
      </p>
    </div>

    <div v-else class="mx-auto flex max-w-[460px] flex-wrap items-center gap-x-5 gap-y-2">
      <span class="w-full shrink-0 text-[0.58rem] tracking-[0.32em] text-cream-muted sm:w-auto"
        >MONTHLY SALARY</span
      >
      <span class="flex-1 font-mono text-base tabular-nums text-cream">${{ formattedSalary }}</span>
      <button
        class="shrink-0 border border-border px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.22em] text-cream-muted transition-colors hover:border-gold-dim hover:text-gold"
        @click="startEdit"
      >
        EDIT
      </button>
    </div>
  </div>
</template>
