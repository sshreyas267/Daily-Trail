import { describe, expect, it } from 'vitest';
import { applyFinish, applyOpen, newStreak, type StreakState } from './streak';

/** Plays through dates in order: "open" only visits, "play" visits and finishes. */
function run(days: [string, 'open' | 'play'][]) {
  let streak: StreakState = newStreak(days[0][0]);
  const changes: string[] = [];
  for (const [date, action] of days) {
    const opened = applyOpen(streak, date);
    streak = opened.streak;
    if (opened.change) changes.push(opened.change.type);
    if (action === 'play') streak = applyFinish(streak, date);
  }
  return { streak, changes };
}

// 2026-11-09 is a Monday.
describe('streak', () => {
  it('adds one for each consecutive day', () => {
    const { streak, changes } = run([
      ['2026-11-09', 'play'],
      ['2026-11-10', 'play'],
      ['2026-11-11', 'play'],
    ]);
    expect(streak.count).toBe(3);
    expect(changes).toEqual([]);
    expect(streak.freezes).toBe(1);
  });

  it('covers one missed day with a freeze', () => {
    const { streak, changes } = run([
      ['2026-11-09', 'play'],
      ['2026-11-10', 'play'],
      ['2026-11-12', 'play'],
    ]);
    expect(streak.count).toBe(3);
    expect(streak.freezes).toBe(0);
    expect(changes).toEqual(['freeze_used']);
  });

  it('keeps the streak on open and does not count the frozen day as played', () => {
    const { streak } = run([
      ['2026-11-09', 'play'],
      ['2026-11-11', 'open'],
    ]);
    expect(streak.count).toBe(1);
    expect(streak.lastActiveDate).toBe('2026-11-10');
  });

  it('resets when two days in a row are missed, even with a freeze available', () => {
    const { streak, changes } = run([
      ['2026-11-09', 'play'],
      ['2026-11-10', 'play'],
      ['2026-11-13', 'open'],
    ]);
    expect(streak.count).toBe(0);
    expect(streak.freezes).toBe(1);
    expect(changes).toEqual(['broken']);
  });

  it('resets on a second missed day in the same week, because the freeze is gone', () => {
    const { streak, changes } = run([
      ['2026-11-09', 'play'],
      ['2026-11-11', 'play'],
      ['2026-11-13', 'open'],
    ]);
    expect(streak.count).toBe(0);
    expect(changes).toEqual(['freeze_used', 'broken']);
  });

  it('refills the freeze each Monday', () => {
    const { streak, changes } = run([
      ['2026-11-13', 'play'], // Friday
      ['2026-11-15', 'play'], // Sunday, freeze used for Saturday
      ['2026-11-16', 'play'], // Monday, refilled
      ['2026-11-18', 'play'], // Wednesday, freeze used for Tuesday
    ]);
    expect(streak.count).toBe(4);
    expect(changes).toEqual(['freeze_used', 'freeze_used']);
    expect(streak.freezes).toBe(0);
  });

  it('holds at most one freeze', () => {
    const { streak } = run([
      ['2026-11-09', 'play'],
      ['2026-11-16', 'open'],
      ['2026-11-23', 'open'],
    ]);
    expect(streak.freezes).toBe(1);
  });

  it('resets across a week boundary when two days in a row are missed', () => {
    const { streak, changes } = run([
      ['2026-11-14', 'play'], // Saturday
      ['2026-11-17', 'open'], // Sunday and Monday missed
    ]);
    expect(streak.count).toBe(0);
    expect(changes).toEqual(['broken']);
  });

  it('starts again after a reset', () => {
    const { streak } = run([
      ['2026-11-09', 'play'],
      ['2026-11-13', 'play'],
      ['2026-11-14', 'play'],
    ]);
    expect(streak.count).toBe(2);
  });

  it('does not change on repeated opens or a second finish on the same day', () => {
    const played = applyFinish(newStreak('2026-11-09'), '2026-11-09');
    expect(applyFinish(played, '2026-11-09')).toBe(played);
    expect(applyOpen(played, '2026-11-09').change).toBeNull();
    expect(applyOpen(played, '2026-11-09').streak).toEqual(played);

    const frozen = applyOpen(played, '2026-11-11').streak;
    const again = applyOpen(frozen, '2026-11-11');
    expect(again.change).toBeNull();
    expect(again.streak).toEqual(frozen);
  });

  it('does not use a freeze when a player with no streak misses a day', () => {
    const { streak, changes } = run([
      ['2026-11-09', 'open'],
      ['2026-11-11', 'open'],
    ]);
    expect(streak.freezes).toBe(1);
    expect(changes).toEqual([]);
  });

  it('counts a hunt finished after midnight for the day it belongs to', () => {
    const played = applyFinish(newStreak('2026-11-09'), '2026-11-09');
    const next = applyFinish(played, '2026-11-10');
    expect(next.count).toBe(2);
    expect(next.lastActiveDate).toBe('2026-11-10');
  });
});
