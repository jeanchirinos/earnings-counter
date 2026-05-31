export interface Currency {
  code: string
  name: string
  symbol: string
  locale: string
}

export type Timeframe = 'today' | 'week' | 'month' | 'year'

export type Theme = 'dark' | 'light' | 'system'

export interface WorkSchedule {
  isActive: boolean
  daysOfWeek: number[] // 0-6 (0 is Sunday, 1 is Monday, etc.)
  startTime: string // e.g. "09:00"
  endTime: string // e.g. "17:00"
}
