import type { Hunt } from '../data/hunts';
import { hunts, PRACTICE_COUNT, practiceHunts } from '../data/hunts';
import {
  applyOpen,
  dayNumberFor,
  daysBetween,
  isDateKey,
  newStreak,
  puzzleForDay,
  toDateKey,
  type StreakChange,
  type StreakState,
} from '../engine';
import { clearAll, createMemoryBackend, createStore, type StorageBackend, type Store } from '../storage';
import { createInitialState, type GameState } from './reducer';
import { addToTrail, trailEntryFor, type TrailEntry } from './trail';

export type Overrides = {
  day: number | null;
  date: string | null;
  practice: number | null;
  replay: number | null;
  reset: boolean;
};

const positive = (raw: string | null): number | null => (/^[1-9]\d*$/.test(raw ?? '') ? Number(raw) : null);

export function parseOverrides(search: string): Overrides {
  const params = new URLSearchParams(search);
  const rawDate = params.get('date') ?? '';
  const practice = positive(params.get('practice'));
  return {
    day: positive(params.get('day')),
    date: isDateKey(rawDate) ? rawDate : null,
    practice: practice !== null && practice <= PRACTICE_COUNT ? practice : null,
    replay: positive(params.get('replay')),
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

/**
 * live: the real daily hunt. date: a test date with its own saved state.
 * day, practice and replay: one-off plays kept in memory that never count.
 */
export type SessionMode = 'live' | 'day' | 'date' | 'practice' | 'replay';

/** Whether this play counts towards the streak and is saved. */
export const isRealPlay = (mode: SessionMode): boolean => mode === 'live' || mode === 'date';

export type Session = {
  mode: SessionMode;
  dateKey: string;
  dayNumber: number;
  hunt: Hunt;
  store: Store;
  /** Null for plays that never count, which have no streak. */
  streak: StreakState | null;
  /** Finished daily hunts, newest first. Empty for plays that never count. */
  trail: TrailEntry[];
  streakChange: StreakChange | null;
  initialGame: GameState;
  isNewPlayer: boolean;
  daysSinceLast: number | null;
};

type SavedGame = { dateKey: string; state: GameState };

export const saveGame = (session: Session, state: GameState): void =>
  session.store.save('game', { dateKey: session.dateKey, state } satisfies SavedGame);

export const saveStreak = (session: Session, streak: StreakState): void =>
  session.store.save('streak', streak);

export const saveTrail = (session: Session, trail: TrailEntry[]): void => session.store.save('trail', trail);

export function createSession(search: string, now: Date, backend: StorageBackend): Session {
  const overrides = parseOverrides(search);
  if (overrides.reset) clearAll(backend);

  const mode: SessionMode = overrides.practice
    ? 'practice'
    : overrides.replay
      ? 'replay'
      : overrides.day
        ? 'day'
        : overrides.date
          ? 'date'
          : 'live';
  const dateKey = overrides.date && mode === 'date' ? overrides.date : toDateKey(now);
  const dayNumber =
    mode === 'practice' ? overrides.practice! : (overrides.replay ?? overrides.day ?? dayNumberFor(dateKey));
  const hunt = mode === 'practice' ? practiceHunts[dayNumber - 1] : hunts[puzzleForDay(dayNumber) - 1];

  // Plays that never count only write to memory. ?date=... has its own namespace.
  const store = isRealPlay(mode)
    ? createStore(mode === 'date' ? 'test' : 'live', backend)
    : createStore(mode, createMemoryBackend());

  let streak: StreakState | null = null;
  let streakChange: StreakChange | null = null;
  if (isRealPlay(mode)) {
    const opened = applyOpen(store.load<StreakState>('streak') ?? newStreak(dateKey), dateKey);
    streak = opened.streak;
    streakChange = opened.change;
    store.save('streak', streak);
  }

  const lastVisit = store.load<string>('last_visit');
  store.save('last_visit', dateKey);

  const saved = store.load<SavedGame>('game');
  const canResume = saved?.dateKey === dateKey && saved.state.puzzle === hunt.day;
  const initialGame = canResume ? saved.state : createInitialState(hunt, dayNumber);

  // A hunt finished before the trail existed is added the next time the game opens.
  let trail = store.load<TrailEntry[]>('trail') ?? [];
  if (isRealPlay(mode) && initialGame.finishedAt !== null) {
    const withToday = addToTrail(trail, trailEntryFor(initialGame, dateKey));
    if (withToday !== trail) store.save('trail', withToday);
    trail = withToday;
  }

  return {
    mode,
    dateKey,
    dayNumber,
    hunt,
    store,
    streak,
    streakChange,
    trail,
    initialGame,
    isNewPlayer: lastVisit === null,
    daysSinceLast: lastVisit === null ? null : daysBetween(lastVisit, dateKey),
  };
}
