import { describe, expect, it } from 'vitest';
import { hunts } from '../data/hunts';
import { createGameReducer, createInitialState } from './reducer';
import { addToTrail, trailEntryFor, trailRows, type TrailEntry } from './trail';

const entry = (dayNumber: number, score = 300): TrailEntry => ({
  dayNumber,
  dateKey: `2026-11-${String(5 + dayNumber).padStart(2, '0')}`,
  puzzle: ((dayNumber - 1) % 7) + 1,
  score,
  secs: 60,
  hints: [0, 1, 3],
  wrong: 0,
});

describe('trail', () => {
  it('records a finished hunt with its score, time and hints', () => {
    const hunt = hunts[0];
    const reduce = createGameReducer(hunt);
    let state = reduce(createInitialState(hunt, 1), { type: 'start', now: 0 });
    state = reduce(state, { type: 'hint' });
    for (const [index, stage] of hunt.stages.entries()) {
      state = reduce(state, { type: 'submit', answer: stage.answer, now: (index + 1) * 10_000 });
      if (index < 2) state = reduce(state, { type: 'advance', now: (index + 1) * 10_000 });
    }
    expect(trailEntryFor(state, '2026-11-06')).toEqual({
      dayNumber: 1,
      dateKey: '2026-11-06',
      puzzle: 1,
      score: 285,
      secs: 30,
      hints: [1, 0, 0],
      wrong: 0,
    });
  });

  it('keeps the newest first and the first result for a day', () => {
    let trail = addToTrail([], entry(1));
    trail = addToTrail(trail, entry(3));
    trail = addToTrail(trail, entry(2));
    trail = addToTrail(trail, entry(3, 20));
    expect(trail.map((item) => item.dayNumber)).toEqual([3, 2, 1]);
    expect(trail[0].score).toBe(300);
  });

  it('builds rows with the hunt and the squares', () => {
    const [row] = trailRows([entry(9)], { puzzle: 1, finished: true });
    expect(row.hunt.word).toBe(hunts[1].word);
    expect(row.squares).toBe('🟩🟨⬛');
    expect(row.squaresLabel).toBe('no hint, with hints, answer shown');
    expect(row.open).toBe(true);
  });

  it('hides the answers of a past hunt that repeats today until today is finished', () => {
    const trail = [entry(1), entry(2)];
    expect(trailRows(trail, { puzzle: 1, finished: false }).map((row) => row.open)).toEqual([false, true]);
    expect(trailRows(trail, { puzzle: 1, finished: true }).map((row) => row.open)).toEqual([true, true]);
  });
});
