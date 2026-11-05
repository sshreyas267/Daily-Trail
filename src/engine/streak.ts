import { daysBetween, weekKey } from './dates';

export type StreakState = {
  count: number;
  /** The last day that was finished, or covered by a freeze. */
  lastActiveDate: string | null;
  freezes: number;
  freezeWeek: string;
};

export type StreakChange =
  | { type: 'freeze_used'; streak: number; freezes_left: number }
  | { type: 'broken'; previous_streak: number };

export const newStreak = (today: string): StreakState => ({
  count: 0,
  lastActiveDate: null,
  freezes: 1,
  freezeWeek: weekKey(today),
});

const refill = (state: StreakState, today: string): StreakState => {
  const week = weekKey(today);
  return state.freezeWeek === week ? state : { ...state, freezes: 1, freezeWeek: week };
};

/** Applies missed days when the app opens. Safe to call repeatedly on the same day. */
export function applyOpen(
  previous: StreakState,
  today: string,
): { streak: StreakState; change: StreakChange | null } {
  const state = refill(previous, today);
  if (state.lastActiveDate === null || state.count === 0) return { streak: state, change: null };

  const missedDays = daysBetween(state.lastActiveDate, today) - 1;
  if (missedDays <= 0) return { streak: state, change: null };

  if (missedDays === 1 && state.freezes > 0) {
    const freezes = state.freezes - 1;
    return {
      streak: { ...state, freezes, lastActiveDate: yesterdayOf(today) },
      change: { type: 'freeze_used', streak: state.count, freezes_left: freezes },
    };
  }

  return {
    streak: { ...state, count: 0, lastActiveDate: null },
    change: { type: 'broken', previous_streak: state.count },
  };
}

/** Counts a finished hunt for its date. Finishing the same day twice changes nothing. */
export function applyFinish(previous: StreakState, huntDate: string): StreakState {
  if (previous.lastActiveDate !== null && daysBetween(previous.lastActiveDate, huntDate) <= 0) {
    return previous;
  }
  const { streak } = applyOpen(previous, huntDate);
  return { ...streak, count: streak.count + 1, lastActiveDate: huntDate };
}

const yesterdayOf = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
};
