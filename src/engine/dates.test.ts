import { describe, expect, it } from 'vitest';
import { dayNumberFor, daysBetween, isDateKey, puzzleForDay, toDateKey, weekKey } from './dates';

describe('day number', () => {
  it.each([
    ['2026-11-01', 1],
    ['2026-11-05', 1],
    ['2026-11-06', 1],
    ['2026-11-07', 2],
    ['2026-11-13', 8],
    ['2027-11-06', 366],
  ])('on %s is %i', (date, day) => {
    expect(dayNumberFor(date)).toBe(day);
  });
});

describe('puzzle number', () => {
  it.each([
    [1, 1],
    [7, 7],
    [8, 1],
    [14, 7],
    [15, 1],
  ])('on day %i is puzzle %i', (day, puzzle) => {
    expect(puzzleForDay(day)).toBe(puzzle);
  });
});

describe('dates', () => {
  it('counts calendar days across daylight saving changes', () => {
    expect(daysBetween('2027-03-13', '2027-03-15')).toBe(2);
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(daysBetween('2026-11-07', '2026-11-06')).toBe(-1);
  });

  it('starts weeks on Monday', () => {
    expect(weekKey('2026-11-09')).toBe('2026-11-09');
    expect(weekKey('2026-11-15')).toBe('2026-11-09');
    expect(weekKey('2026-11-16')).toBe('2026-11-16');
  });

  it('reads the local calendar date', () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('accepts only real dates', () => {
    expect(isDateKey('2026-11-06')).toBe(true);
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('nope')).toBe(false);
    expect(isDateKey('2026-1-6')).toBe(false);
  });
});
