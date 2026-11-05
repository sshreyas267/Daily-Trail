import { describe, expect, it } from 'vitest';
import { hunts, practiceHunts } from '../data/hunts';
import { applyFinish } from '../engine';
import { createMemoryBackend } from '../storage';
import { createGameReducer } from './reducer';
import { createSession, parseOverrides, saveGame, saveStreak, withoutReset } from './session';

const ON = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);
const NOV_9 = ON(2026, 11, 9); // day 4, puzzle 4

describe('parseOverrides', () => {
  it('reads valid values and ignores anything else', () => {
    expect(parseOverrides('?day=3').day).toBe(3);
    expect(parseOverrides('?day=0').day).toBeNull();
    expect(parseOverrides('?day=abc').day).toBeNull();
    expect(parseOverrides('?date=2026-11-20').date).toBe('2026-11-20');
    expect(parseOverrides('?date=2026-13-40').date).toBeNull();
    expect(parseOverrides('?reset=1').reset).toBe(true);
    expect(parseOverrides('').reset).toBe(false);
  });

  it('removes only reset from the address', () => {
    expect(withoutReset('?reset=1')).toBe('');
    expect(withoutReset('?reset=1&date=2026-11-20')).toBe('?date=2026-11-20');
  });
});

describe('createSession', () => {
  it('picks the hunt from the date', () => {
    const session = createSession('', NOV_9, createMemoryBackend());
    expect(session.mode).toBe('live');
    expect(session.dayNumber).toBe(4);
    expect(session.hunt.word).toBe('RAT');
  });

  it('wraps the puzzle but keeps the day number increasing', () => {
    const session = createSession('', ON(2026, 11, 13), createMemoryBackend());
    expect(session.dayNumber).toBe(8);
    expect(session.hunt.word).toBe('SEA');
  });

  it('resumes today from saved progress, and starts fresh on a new day', () => {
    const backend = createMemoryBackend();
    const first = createSession('', NOV_9, backend);
    const reduce = createGameReducer(first.hunt);
    saveGame(first, reduce(first.initialGame, { type: 'start', now: 5 }));

    const reloaded = createSession('', NOV_9, backend);
    expect(reloaded.initialGame.phase).toBe('playing');
    expect(reloaded.initialGame.startedAt).toBe(5);

    expect(createSession('', ON(2026, 11, 10), backend).initialGame.phase).toBe('idle');
  });

  it('never touches real data under ?day=N', () => {
    const backend = createMemoryBackend();
    const session = createSession('?day=2', NOV_9, backend);
    expect(session.mode).toBe('day');
    expect(session.hunt.word).toBe('MAP');
    expect(session.streak).toBeNull();
    saveGame(session, session.initialGame);
    expect(backend.length).toBe(0);
  });

  it('keeps ?date= apart from real progress, and carries its streak across dates', () => {
    const backend = createMemoryBackend();
    const live = createSession('', NOV_9, backend);
    saveStreak(live, applyFinish(live.streak!, live.dateKey));

    const first = createSession('?date=2026-11-20', NOV_9, backend);
    expect(first.mode).toBe('date');
    expect(first.dateKey).toBe('2026-11-20');
    expect(first.streak?.count).toBe(0);
    saveStreak(first, applyFinish(first.streak!, first.dateKey));

    expect(createSession('?date=2026-11-21', NOV_9, backend).streak?.count).toBe(1);
    expect(createSession('', NOV_9, backend).streak?.count).toBe(1);
    expect(createSession('', NOV_9, backend).dateKey).toBe('2026-11-09');
  });

  it('reports a freeze being used when the app opens', () => {
    const backend = createMemoryBackend();
    const session = createSession('', NOV_9, backend);
    saveStreak(session, applyFinish(session.streak!, session.dateKey));
    const later = createSession('', ON(2026, 11, 11), backend);
    expect(later.streakChange?.type).toBe('freeze_used');
    expect(createSession('', ON(2026, 11, 11), backend).streakChange).toBeNull();
  });

  it('clears everything under ?reset=1', () => {
    const backend = createMemoryBackend();
    const session = createSession('', NOV_9, backend);
    saveStreak(session, applyFinish(session.streak!, session.dateKey));
    expect(createSession('?reset=1', NOV_9, backend).streak?.count).toBe(0);
  });

  it('starts fresh if saved progress is for a different puzzle', () => {
    const backend = createMemoryBackend();
    const session = createSession('', NOV_9, backend);
    saveGame(session, { ...session.initialGame, phase: 'finished', puzzle: hunts[0].day });
    expect(createSession('', NOV_9, backend).initialGame.phase).toBe('idle');
  });

  it('opens practice hunts in memory only, apart from the daily hunts', () => {
    const backend = createMemoryBackend();
    const session = createSession('?practice=2', NOV_9, backend);
    expect(session.mode).toBe('practice');
    expect(session.hunt).toBe(practiceHunts[1]);
    expect(session.streak).toBeNull();
    saveGame(session, session.initialGame);
    expect(backend.length).toBe(0);
    expect(createSession('?practice=9', NOV_9, backend).mode).toBe('live');
  });

  it('replays a past day by its day number, in memory only', () => {
    const backend = createMemoryBackend();
    const session = createSession('?replay=9', NOV_9, backend);
    expect(session.mode).toBe('replay');
    expect(session.dayNumber).toBe(9);
    expect(session.hunt).toBe(hunts[1]);
    saveGame(session, session.initialGame);
    expect(backend.length).toBe(0);
  });

  it('adds a hunt finished before the trail existed when the game opens', () => {
    const backend = createMemoryBackend();
    const first = createSession('', NOV_9, backend);
    expect(first.trail).toEqual([]);
    const reduce = createGameReducer(first.hunt);
    let state = reduce(first.initialGame, { type: 'start', now: 0 });
    for (const [index, stage] of first.hunt.stages.entries()) {
      state = reduce(state, { type: 'submit', answer: stage.answer, now: 1000 });
      if (index < 2) state = reduce(state, { type: 'advance', now: 1000 });
    }
    saveGame(first, state);
    const reopened = createSession('', NOV_9, backend);
    expect(reopened.trail.map((entry) => entry.dayNumber)).toEqual([4]);
    expect(createSession('', NOV_9, backend).trail).toHaveLength(1);
    expect(createSession('?date=2026-11-09', NOV_9, backend).trail).toEqual([]);
  });
});
