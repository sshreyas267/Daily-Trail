import { describe, expect, it } from 'vitest';
import { hunts } from '../data/hunts';
import { createGameReducer, createInitialState, type GameAction, type GameState } from './reducer';
import { elapsedSecs, foundLetters, formatTime, totalHints, totalScore, totalWrong } from './selectors';

const hunt = hunts[0];
const reducer = createGameReducer(hunt);
const play = (actions: GameAction[], from = createInitialState(hunt, 1)): GameState =>
  actions.reduce(reducer, from);

const T0 = 1_000_000;
const solve = (answer: string, now: number): GameAction => ({ type: 'submit', answer, now });
const started: GameAction = { type: 'start', now: T0 };

describe('gameReducer', () => {
  it('starts idle and records the start time on Start', () => {
    expect(createInitialState(hunt, 1).phase).toBe('idle');
    const state = play([started]);
    expect(state.phase).toBe('playing');
    expect(state.startedAt).toBe(T0);
  });

  it('counts a wrong answer without changing the points or the phase', () => {
    const state = play([started, solve('nope', T0 + 1000)]);
    expect(state.phase).toBe('playing');
    expect(state.stages[0].wrong).toBe(1);
    expect(state.stages[0].points).toBe(0);
  });

  it('ignores an empty answer', () => {
    expect(play([started, solve('  !! ', T0)]).stages[0].wrong).toBe(0);
  });

  it('allows three hints at most and scores from the hints taken', () => {
    const state = play([
      started,
      { type: 'hint' },
      { type: 'hint' },
      { type: 'hint' },
      { type: 'hint' },
      solve('sponge', T0 + 5000),
    ]);
    expect(state.stages[0].hints).toBe(3);
    expect(state.stages[0].points).toBe(20);
  });

  it('ignores hints and answers once the stage is solved', () => {
    const solved = play([started, solve('sponge', T0 + 2000)]);
    expect(solved.phase).toBe('stageSolved');
    expect(reducer(solved, { type: 'hint' })).toBe(solved);
    expect(reducer(solved, solve('nope', T0))).toBe(solved);
  });

  it('times each stage from when it appeared', () => {
    const state = play([
      started,
      solve('sponge', T0 + 2000),
      { type: 'advance', now: T0 + 5000 },
      solve('emerald', T0 + 12000),
    ]);
    expect(state.stages[0].secs).toBe(2);
    expect(state.stages[1].secs).toBe(7);
  });

  it('plays through all three stages to the finish and stops the clock', () => {
    const state = play([
      started,
      solve('sponge', T0 + 1000),
      { type: 'advance', now: T0 + 2000 },
      { type: 'hint' },
      solve('wrong', T0 + 3000),
      solve('emerald', T0 + 4000),
      { type: 'advance', now: T0 + 5000 },
      { type: 'hint' },
      { type: 'hint' },
      solve('aug', T0 + 61000),
    ]);
    expect(state.phase).toBe('stageSolved');
    expect(state.finishedAt).toBe(T0 + 61000);

    const finished = reducer(state, { type: 'advance', now: T0 + 90000 });
    expect(finished.phase).toBe('finished');
    expect(totalScore(finished)).toBe(100 + 85 + 60);
    expect(totalHints(finished)).toBe(3);
    expect(totalWrong(finished)).toBe(1);
    expect(elapsedSecs(finished, T0 + 999000)).toBe(61);
    expect(foundLetters(hunt, finished).join('')).toBe('SEA');
  });
});

describe('selectors', () => {
  it('shows only the letters that have been found', () => {
    const state = play([started, solve('sponge', T0)]);
    expect(foundLetters(hunt, state)).toEqual(['S', null, null]);
  });

  it('formats time as minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(600)).toBe('10:00');
  });
});
