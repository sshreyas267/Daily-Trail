import type { Hunt } from '../data/hunts';
import { hunts } from '../data/hunts';
import {
  applyOpen,
  dayNumberFor,
  isDateKey,
  newStreak,
  puzzleForDay,
  toDateKey,
  type StreakChange,
  type StreakState,
} from '../engine';
import { clearAll, createMemoryBackend, createStore, type StorageBackend, type Store } from '../storage';
import { createInitialState, type GameState } from './reducer';

export type Overrides = { day: number | null; date: string | null; reset: boolean };

export function parseOverrides(search: string): Overrides {
  const params = new URLSearchParams(search);
  const rawDay = params.get('day') ?? '';
  const rawDate = params.get('date') ?? '';
  return {
    day: /^[1-9]\d*$/.test(rawDay) ? Number(rawDay) : null,
    date: isDateKey(rawDate) ? rawDate : null,
    reset: params.get('reset') === '1',
  };
}

/** The address without ?reset=1, so a reload does not clear progress again. */
export function withoutReset(search: string): string {
  const params = new URLSearchParams(search);
  params.delete('reset');
  const rest = params.toString();
  return rest ? `?${rest}` : '';
}

export type SessionMode = 'live' | 'day' | 'date';

export type Session = {
  mode: SessionMode;
  dateKey: string;
  dayNumber: number;
  hunt: Hunt;
  store: Store;
  /** Null under ?day=N, where a play has no streak. */
  streak: StreakState | null;
  streakChange: StreakChange | null;
  initialGame: GameState;
};

type SavedGame = { dateKey: string; state: GameState };

export const saveGame = (session: Session, state: GameState): void =>
  session.store.save('game', { dateKey: session.dateKey, state } satisfies SavedGame);

export const saveStreak = (session: Session, streak: StreakState): void =>
  session.store.save('streak', streak);

export function createSession(search: string, now: Date, backend: StorageBackend): Session {
  const overrides = parseOverrides(search);
  if (overrides.reset) clearAll(backend);

  const mode: SessionMode = overrides.day ? 'day' : overrides.date ? 'date' : 'live';
  const dateKey = overrides.date && mode === 'date' ? overrides.date : toDateKey(now);
  const dayNumber = overrides.day ?? dayNumberFor(dateKey);
  const hunt = hunts[puzzleForDay(dayNumber) - 1];

  // ?day=N only ever writes to memory. ?date=... has its own namespace.
  const store =
    mode === 'day'
      ? createStore('day', createMemoryBackend())
      : createStore(mode === 'date' ? 'test' : 'live', backend);

  let streak: StreakState | null = null;
  let streakChange: StreakChange | null = null;
  if (mode !== 'day') {
    const opened = applyOpen(store.load<StreakState>('streak') ?? newStreak(dateKey), dateKey);
    streak = opened.streak;
    streakChange = opened.change;
    store.save('streak', streak);
  }

  const saved = store.load<SavedGame>('game');
  const canResume = saved?.dateKey === dateKey && saved.state.puzzle === hunt.day;
  return {
    mode,
    dateKey,
    dayNumber,
    hunt,
    store,
    streak,
    streakChange,
    initialGame: canResume ? saved.state : createInitialState(hunt, dayNumber),
  };
}
