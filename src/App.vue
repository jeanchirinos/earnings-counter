<script setup lang="ts">
import { onMounted } from 'vue'
import { useSalaryStore } from '@/stores/salary'
import { useCurrencyStore } from '@/stores/currency'
import { useScheduleStore } from '@/stores/schedule'
import { useThemeStore } from '@/stores/theme'
import EarningsDisplay from '@/components/EarningsDisplay.vue'
import SalaryInput from '@/components/SalaryInput.vue'
import ScheduleSettings from '@/components/ScheduleSettings.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const salaryStore = useSalaryStore()
const currencyStore = useCurrencyStore()
const scheduleStore = useScheduleStore()
const themeStore = useThemeStore()

onMounted(() => {
  salaryStore.loadFromStorage()
  currencyStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  themeStore.loadFromStorage()
})
</script>

<template>
  <div
    class="relative mx-auto grid min-h-screen w-full max-w-4xl grid-rows-[auto_1fr_auto] overflow-hidden px-12 py-6 max-sm:px-5 max-sm:py-6"
  >
    <div
      class="grain-bg fixed inset-0 z-0 pointer-events-none opacity-[0.035]"
      aria-hidden="true"
    />

    <header class="relative z-50 animate-slide-down">
      <div class="flex items-center justify-between gap-4">
        <ThemeToggle />

        <div class="flex items-center gap-3">
          <span
            class="font-mono text-[0.68rem] max-sm:text-[0.6rem] font-medium tracking-[0.35em] text-gold"
            >EARNINGS</span
          >
          <span class="text-[0.5rem] text-gold-dim">·</span>
          <span
            class="font-mono text-[0.68rem] max-sm:text-[0.6rem] font-medium tracking-[0.35em] text-gold"
            >COUNTER</span
          >
        </div>

        <ScheduleSettings />
      </div>

      <div class="mt-4 h-px bg-linear-to-r from-gold-dim to-transparent" />
    </header>

    <main
      class="relative z-10 flex items-center justify-center animate-fade-in [animation-delay:0.25s]"
    >
      <EarningsDisplay />
    </main>

    <footer
      class="relative z-10 w-full flex flex-col pb-4 sm:pb-3 animate-slide-up [animation-delay:0.4s]"
    >
      <SalaryInput />
    </footer>
  </div>
</template>
