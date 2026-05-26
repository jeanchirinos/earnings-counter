<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalaryStore } from '@/stores/salary'
import { useEarningsCounter } from '@/composables/useEarningsCounter'

const salaryStore = useSalaryStore()
const { monthlySalary } = storeToRefs(salaryStore)

const { earnings, salaryPerSecond, daysInMonth } = useEarningsCounter(monthlySalary)

const isPulsing = ref(false)

let pulseTimeoutId: ReturnType<typeof setTimeout> | null = null

watch(earnings, () => {
  isPulsing.value = true

  if (pulseTimeoutId !== null) clearTimeout(pulseTimeoutId)

  pulseTimeoutId = setTimeout(() => {
    isPulsing.value = false
    pulseTimeoutId = null
  }, 400)
})

onUnmounted(() => {
  if (pulseTimeoutId !== null) clearTimeout(pulseTimeoutId)
})

const integerPart = computed(() => Math.floor(earnings.value).toLocaleString('en-US'))

const decimalPart = computed(() => {
  const fractionalPart = earnings.value % 1
  const decimalString = fractionalPart.toFixed(4).slice(1)

  return decimalString
})

const perSecondFormatted = computed(() => salaryPerSecond.value.toFixed(6))

const progressPercent = computed(() => {
  if (!monthlySalary.value) return 0

  const clampedProgressPercent = Math.min((earnings.value / monthlySalary.value) * 100, 100)

  return clampedProgressPercent
})

const hasSalary = computed(() => monthlySalary.value !== null && monthlySalary.value > 0)
</script>

<template>
  <div class="w-full max-w-3xl py-4 text-center sm:py-8">
    <div v-if="!hasSalary" class="flex flex-col items-center gap-6 py-6 sm:py-12 lg:py-16">
      <p class="text-[0.8rem] uppercase tracking-[0.18em] text-cream-muted">
        Set your monthly salary below to start tracking
      </p>
      <div class="text-2xl text-gold-dim animate-float">↓</div>
    </div>

    <template v-else>
      <div
        class="mb-2 inline-flex items-start gap-1 transition-opacity duration-200 sm:mb-4 lg:mb-5"
        :class="{ 'opacity-70': isPulsing }"
      >
        <span
          class="pt-2 font-normal font-display text-[1.2rem] leading-none text-gold-dim sm:pt-3 sm:text-[1.8rem] lg:pt-5 lg:text-[2.5rem]"
          >$</span
        >
        <div class="flex items-baseline">
          <span
            class="font-bold font-display text-[3rem] leading-[0.88] tabular-nums tracking-[-0.03em] text-gold sm:text-[5rem] lg:text-[7.5rem]"
          >
            {{ integerPart }}
          </span>
          <span
            class="self-end pb-1 font-mono text-[1rem] tabular-nums tracking-[-0.01em] text-gold-dim sm:pb-2 sm:text-[1.6rem] lg:pb-2.5 lg:text-[2rem]"
          >
            {{ decimalPart }}
          </span>
        </div>
      </div>

      <p class="mb-4 text-[0.6rem] tracking-[0.35em] text-cream-muted sm:mb-7 lg:mb-10">
        EARNED THIS MONTH
      </p>

      <div class="mx-auto mb-4 h-8 w-px bg-border sm:mb-7 sm:h-10 lg:mb-10" />

      <div
        class="mb-6 flex items-center justify-center gap-6 sm:mb-10 sm:gap-10 lg:mb-14 lg:gap-12"
      >
        <div class="flex flex-col gap-1.5">
          <span class="font-mono text-base tabular-nums tracking-[-0.01em] text-cream">
            +${{ perSecondFormatted }}
          </span>
          <span class="text-[0.58rem] uppercase tracking-[0.22em] text-cream-muted"
            >per second</span
          >
        </div>
        <div class="h-8 w-px bg-border" />
        <div class="flex flex-col gap-1.5">
          <span class="font-mono text-base tabular-nums tracking-[-0.01em] text-cream">
            {{ daysInMonth }}
          </span>
          <span class="text-[0.58rem] uppercase tracking-[0.22em] text-cream-muted"
            >days this month</span
          >
        </div>
      </div>

      <div class="mx-auto mb-3.5 h-px w-full max-w-[380px] overflow-hidden bg-border">
        <div
          class="h-full bg-gradient-to-r from-gold-dim to-gold transition-[width] duration-[1200ms] ease-linear"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <p class="text-[0.58rem] tracking-[0.18em] text-cream-muted">
        {{ progressPercent.toFixed(2) }}% of monthly salary
      </p>
    </template>
  </div>
</template>
