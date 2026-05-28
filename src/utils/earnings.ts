import type { Timeframe, WorkSchedule } from '@/types'

function parseTimeToSeconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const seconds = hours * 3600 + minutes * 60

  return seconds
}

export function getDaysInCurrentMonth(): number {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  return daysInMonth
}

function getPeriodBounds({ timeframe, now }: { timeframe: Timeframe; now: Date }): {
  start: Date
  end: Date
} {
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  if (timeframe === 'today') {
    const periodStart = new Date(year, month, date, 0, 0, 0, 0)
    const periodEnd = new Date(year, month, date, 23, 59, 59, 999)
    return { start: periodStart, end: periodEnd }
  } else if (timeframe === 'week') {
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const periodStart = new Date(year, month, date - diffToMonday, 0, 0, 0, 0)
    const periodEnd = new Date(year, month, date - diffToMonday + 6, 23, 59, 59, 999)
    return { start: periodStart, end: periodEnd }
  } else if (timeframe === 'month') {
    const periodStart = new Date(year, month, 1, 0, 0, 0, 0)
    const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999)
    return { start: periodStart, end: periodEnd }
  } else {
    const periodStart = new Date(year, 0, 1, 0, 0, 0, 0)
    const periodEnd = new Date(year, 11, 31, 23, 59, 59, 999)
    return { start: periodStart, end: periodEnd }
  }
}

export function getTotalSecondsInPeriod({
  timeframe,
  schedule,
}: {
  timeframe: Timeframe
  schedule?: WorkSchedule
}): number {
  const now = new Date()

  const { start, end } = getPeriodBounds({ timeframe, now })

  if (!schedule || !schedule.isActive) {
    const totalSeconds = Math.floor((end.getTime() - start.getTime() + 1) / 1000)
    return totalSeconds
  }

  let workableSeconds = 0
  const startSeconds = parseTimeToSeconds(schedule.startTime)
  const endSeconds = parseTimeToSeconds(schedule.endTime)
  const dailySeconds = Math.max(0, endSeconds - startSeconds)

  const currentDate = new Date(start)
  currentDate.setHours(0, 0, 0, 0)

  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  while (currentDate <= endDate) {
    if (schedule.daysOfWeek.includes(currentDate.getDay())) {
      workableSeconds += dailySeconds
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return workableSeconds
}

export function getElapsedSecondsInPeriod({
  timeframe,
  schedule,
}: {
  timeframe: Timeframe
  schedule?: WorkSchedule
}): number {
  const now = new Date()
  const { start } = getPeriodBounds({ timeframe, now })

  if (!schedule || !schedule.isActive) {
    if (now.getTime() < start.getTime()) return 0
    const elapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
    return elapsedSeconds
  }

  let elapsed = 0
  const startSeconds = parseTimeToSeconds(schedule.startTime)
  const endSeconds = parseTimeToSeconds(schedule.endTime)
  const dailySeconds = Math.max(0, endSeconds - startSeconds)
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  const currentDate = new Date(start)
  currentDate.setHours(0, 0, 0, 0)

  const todayDate = new Date(now)
  todayDate.setHours(0, 0, 0, 0)

  if (now.getTime() < start.getTime()) return 0

  while (currentDate < todayDate) {
    if (schedule.daysOfWeek.includes(currentDate.getDay())) {
      elapsed += dailySeconds
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (schedule.daysOfWeek.includes(now.getDay()) && currentDate.getTime() === todayDate.getTime()) {
    if (currentSeconds > startSeconds) {
      const todayElapsed = Math.min(currentSeconds, endSeconds) - startSeconds
      elapsed += todayElapsed
    }
  }

  return elapsed
}

export function getTotalSecondsInMonth(schedule?: WorkSchedule): number {
  return getTotalSecondsInPeriod({ timeframe: 'month', schedule })
}

export function getElapsedSecondsThisMonth(schedule?: WorkSchedule): number {
  return getElapsedSecondsInPeriod({ timeframe: 'month', schedule })
}

export function calculateEarnings({
  monthlySalary,
  elapsedSeconds,
  totalSecondsInMonth,
}: {
  monthlySalary: number
  elapsedSeconds: number
  totalSecondsInMonth: number
}): number {
  if (monthlySalary <= 0 || totalSecondsInMonth <= 0) return 0

  const earnings = (monthlySalary / totalSecondsInMonth) * elapsedSeconds

  return earnings
}

export function getSalaryPerSecond({
  monthlySalary,
  totalSecondsInMonth,
}: {
  monthlySalary: number
  totalSecondsInMonth: number
}): number {
  if (monthlySalary <= 0 || totalSecondsInMonth <= 0) return 0

  const salaryPerSecond = monthlySalary / totalSecondsInMonth

  return salaryPerSecond
}

export function getSalaryPerHour({
  monthlySalary,
  totalSecondsInMonth,
}: {
  monthlySalary: number
  totalSecondsInMonth: number
}): number {
  const salaryPerSecond = getSalaryPerSecond({ monthlySalary, totalSecondsInMonth })

  const salaryPerHour = salaryPerSecond * 3600

  return salaryPerHour
}
