import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Timeframe } from '@/types'

export const useTimeframeStore = defineStore('timeframe', () => {
  const timeframe = ref<Timeframe>('month')

  function setTimeframe(newTimeframe: Timeframe) {
    timeframe.value = newTimeframe
  }

  return { timeframe, setTimeframe }
})
