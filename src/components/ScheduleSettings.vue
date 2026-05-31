<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'
import { useThemeStore } from '@/stores/theme'

const scheduleStore = useScheduleStore()
const { schedule } = storeToRefs(scheduleStore)

const themeStore = useThemeStore()
const { resolvedTheme } = storeToRefs(themeStore)

const isEditing = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const DAYS = [
  { value: 1, label: 'MON' },
  { value: 2, label: 'TUE' },
  { value: 3, label: 'WED' },
  { value: 4, label: 'THU' },
  { value: 5, label: 'FRI' },
  { value: 6, label: 'SAT' },
  { value: 0, label: 'SUN' },
]

function handleClickOutside(event: MouseEvent | TouchEvent) {
  if (isEditing.value && containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isEditing.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('touchstart', handleClickOutside)
})

function toggleActive(): void {
  scheduleStore.setSchedule({ ...schedule.value, isActive: !schedule.value.isActive })
}

function toggleDay(dayValue: number): void {
  const days = new Set(schedule.value.daysOfWeek)
  if (days.has(dayValue)) days.delete(dayValue)
  else days.add(dayValue)

  scheduleStore.setSchedule({ ...schedule.value, daysOfWeek: Array.from(days).sort() })
}

function updateTime(field: 'startTime' | 'endTime', event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (value) scheduleStore.setSchedule({ ...schedule.value, [field]: value })
}
</script>

<template>
  <div ref="containerRef">
    <button
      class="flex flex-row items-center gap-1.5 font-mono text-[0.58rem] tracking-[0.2em] transition-colors cursor-pointer"
      :class="
        schedule.isActive ? 'text-gold hover:text-gold-light' : 'text-cream-muted hover:text-cream'
      "
      @click="isEditing = !isEditing"
    >
      <span class="opacity-80">SCHEDULE:</span> {{ schedule.isActive ? 'ON' : 'OFF' }}
    </button>

    <!-- Popup editable floating menu -->
    <div
      v-if="isEditing"
      class="absolute top-full mt-3 w-[340px] max-w-[calc(100vw-2rem)] sm:w-[420px] max-sm:left-1/2 max-sm:-translate-x-1/2 sm:right-0 border border-border bg-bg-surface p-4 sm:p-5 shadow-xl sm:origin-top-right max-sm:origin-top z-50 rounded-sm"
    >
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-border">
        <span class="text-[0.45rem] tracking-[0.3em] text-cream-muted">WORK SCHEDULE</span>
        <button
          class="font-mono text-[0.45rem] tracking-[0.2em] border border-border px-2 py-1 transition-colors hover:border-gold-dim hover:text-gold cursor-pointer"
          :class="schedule.isActive ? 'text-gold border-gold-dim/50' : 'text-cream-muted'"
          @click="toggleActive"
        >
          TURN {{ schedule.isActive ? 'OFF' : 'ON' }}
        </button>
      </div>

      <div v-if="schedule.isActive" class="flex flex-col gap-4 sm:gap-5 animate-fade-in">
        <div class="flex flex-col gap-2">
          <span class="text-[0.45rem] tracking-[0.2em] text-cream-muted opacity-70"
            >ACTIVE DAYS</span
          >
          <div class="flex w-full justify-between gap-1 sm:gap-1.5">
            <button
              v-for="day in DAYS"
              :key="day.value"
              class="flex-1 border py-1.5 font-mono text-[0.55rem] transition-all duration-200 sm:py-2 sm:text-[0.6rem] cursor-pointer"
              :class="
                schedule.daysOfWeek.includes(day.value)
                  ? 'bg-gold border-gold text-bg font-medium'
                  : 'bg-bg border-border text-cream-muted hover:border-gold-dim hover:text-cream'
              "
              @click="toggleDay(day.value)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>

        <div class="flex gap-3 sm:gap-4">
          <div class="flex flex-1 flex-col gap-2 min-w-0">
            <span class="text-[0.45rem] tracking-[0.2em] text-cream-muted opacity-70"
              >START TIME</span
            >
            <div
              class="relative cursor-pointer border border-border bg-bg transition-colors focus-within:border-gold-dim hover:border-gold-dim/50"
            >
              <input
                type="time"
                :value="schedule.startTime"
                required
                class="w-full bg-transparent px-1 sm:px-2 py-2 font-mono text-[0.8rem] text-cream cursor-pointer outline-none sm:py-2.5 sm:text-[0.9rem] tracking-tighter"
                :class="resolvedTheme === 'light' ? '[color-scheme:light]' : '[color-scheme:dark]'"
                @change="updateTime('startTime', $event)"
              />
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-2 min-w-0">
            <span class="text-[0.45rem] tracking-[0.2em] text-cream-muted opacity-70"
              >END TIME</span
            >
            <div
              class="relative cursor-pointer border border-border bg-bg transition-colors focus-within:border-gold-dim hover:border-gold-dim/50"
            >
              <input
                type="time"
                :value="schedule.endTime"
                required
                class="w-full bg-transparent px-1 sm:px-2 py-2 font-mono text-[0.8rem] text-cream cursor-pointer outline-none sm:py-2.5 sm:text-[0.9rem] tracking-tighter"
                :class="resolvedTheme === 'light' ? '[color-scheme:light]' : '[color-scheme:dark]'"
                @change="updateTime('endTime', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="!schedule.isActive" class="pt-1 pb-1">
        <p class="text-[0.6rem] text-cream-muted text-center tracking-wide leading-relaxed">
          Enable the schedule to match<br />your actual working hours.
        </p>
      </div>
    </div>
  </div>
</template>
