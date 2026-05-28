import type { WorkSchedule } from '@/types'

const STORAGE_KEY = 'earnings-counter:schedule'

export const DEFAULT_SCHEDULE: WorkSchedule = {
  isActive: false,
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: '09:00',
  endTime: '18:00',
}

export function useScheduleStorage() {
  function saveSchedule(schedule: WorkSchedule): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
  }

  function loadSchedule(): WorkSchedule {
    const storedScheduleString = localStorage.getItem(STORAGE_KEY)
    if (!storedScheduleString) return DEFAULT_SCHEDULE

    try {
      const parsedSchedule = JSON.parse(storedScheduleString) as Partial<WorkSchedule>

      const validatedSchedule: WorkSchedule = {
        isActive: parsedSchedule.isActive ?? DEFAULT_SCHEDULE.isActive,
        daysOfWeek: parsedSchedule.daysOfWeek ?? DEFAULT_SCHEDULE.daysOfWeek,
        startTime: parsedSchedule.startTime ?? DEFAULT_SCHEDULE.startTime,
        endTime: parsedSchedule.endTime ?? DEFAULT_SCHEDULE.endTime,
      }

      return validatedSchedule
    } catch {
      return DEFAULT_SCHEDULE
    }
  }

  return { saveSchedule, loadSchedule }
}
