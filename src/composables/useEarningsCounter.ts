import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'
import { useTimeframeStore } from '@/stores/timeframe'
import {
  getDaysInCurrentMonth,
  getElapsedSecondsInPeriod,
  getTotalSecondsInPeriod,
  calculateEarnings,
  getSalaryPerSecond,
} from '@/utils/earnings'

export function useEarningsCounter(monthlySalary: Ref<number | null>) {
  const scheduleStore = useScheduleStore()
  const { schedule } = storeToRefs(scheduleStore)

  const timeframeStore = useTimeframeStore()
  const { timeframe } = storeToRefs(timeframeStore)

  const earnings = ref(0)
  const elapsedSeconds = ref(0)
  const daysInMonth = ref(getDaysInCurrentMonth())

  const totalSecondsInMonth = ref(
    getTotalSecondsInPeriod({ timeframe: 'month', schedule: schedule.value }),
  )
  const totalSecondsInPeriod = ref(
    getTotalSecondsInPeriod({ timeframe: timeframe.value, schedule: schedule.value }),
  )

  const salaryPerSecond = computed(() => {
    if (!monthlySalary.value) return 0

    const salaryPerSecond = getSalaryPerSecond({
      monthlySalary: monthlySalary.value,
      totalSecondsInMonth: totalSecondsInMonth.value,
    })

    return salaryPerSecond
  })

  let intervalId: ReturnType<typeof setInterval> | null = null

  function updateEarningsState(): void {
    daysInMonth.value = getDaysInCurrentMonth()
    totalSecondsInMonth.value = getTotalSecondsInPeriod({
      timeframe: 'month',
      schedule: schedule.value,
    })
    totalSecondsInPeriod.value = getTotalSecondsInPeriod({
      timeframe: timeframe.value,
      schedule: schedule.value,
    })
    elapsedSeconds.value = getElapsedSecondsInPeriod({
      timeframe: timeframe.value,
      schedule: schedule.value,
    })

    if (monthlySalary.value) {
      earnings.value = calculateEarnings({
        monthlySalary: monthlySalary.value,
        elapsedSeconds: elapsedSeconds.value,
        totalSecondsInMonth: totalSecondsInMonth.value,
      })
    }
  }

  function startCounter(): void {
    updateEarningsState()

    intervalId = setInterval(updateEarningsState, 1000)
  }

  function stopCounter(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)

      intervalId = null
    }
  }

  onMounted(startCounter)
  onUnmounted(stopCounter)
  watch([monthlySalary, schedule, timeframe], updateEarningsState, { deep: true })

  return { earnings, salaryPerSecond, daysInMonth, elapsedSeconds, totalSecondsInPeriod }
}
