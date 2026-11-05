export const START_DATE = '2026-11-06';
export const HUNT_COUNT = 7;

const MS_PER_DAY = 86_400_000;

const toUtc = (dateKey: string): number => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

const fromUtc = (utc: number): string => new Date(utc).toISOString().slice(0, 10);

/** The local calendar date as YYYY-MM-DD. */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** True only for a real calendar date in YYYY-MM-DD form. */
export function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toUtc(value)) && fromUtc(toUtc(value)) === value;
}

/** Whole calendar days from one date to another. Daylight saving cannot affect this. */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / MS_PER_DAY);
}

/** The Monday that starts the week containing this date. */
export function weekKey(dateKey: string): string {
  const utc = toUtc(dateKey);
  const daysSinceMonday = (new Date(utc).getUTCDay() + 6) % 7;
  return fromUtc(utc - daysSinceMonday * MS_PER_DAY);
}

/** Keeps increasing forever. Dates before START_DATE count as day 1. */
export function dayNumberFor(dateKey: string): number {
  return Math.max(daysBetween(START_DATE, dateKey), 0) + 1;
}

/** Wraps the day number over the seeded hunts, giving 1 to HUNT_COUNT. */
export function puzzleForDay(dayNumber: number): number {
  return ((dayNumber - 1) % HUNT_COUNT) + 1;
}
