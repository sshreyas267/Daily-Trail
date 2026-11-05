import { hunts, type Hunt } from '../data/hunts';
import { puzzleForDay, squareFor } from '../engine';
import type { GameState } from './reducer';
import { elapsedSecs, totalScore, totalWrong } from './selectors';

/** One finished daily hunt, kept so the player can look back at it or play it again. */
export type TrailEntry = {
  dayNumber: number;
  dateKey: string;
  puzzle: number;
  score: number;
  secs: number;
  hints: number[];
  wrong: number;
};

export function trailEntryFor(state: GameState, dateKey: string): TrailEntry {
  return {
    dayNumber: state.dayNumber,
    dateKey,
    puzzle: state.puzzle,
    score: totalScore(state),
    secs: elapsedSecs(state, state.finishedAt ?? 0),
    hints: state.stages.map((stage) => stage.hints),
    wrong: totalWrong(state),
  };
}

/** Adds a finished hunt, newest first. A day already on the trail keeps its first result. */
export function addToTrail(trail: TrailEntry[], entry: TrailEntry): TrailEntry[] {
  if (trail.some((item) => item.dayNumber === entry.dayNumber)) return trail;
  return [entry, ...trail].sort((a, b) => b.dayNumber - a.dayNumber);
}

export type TrailRow = {
  entry: TrailEntry;
  hunt: Hunt;
  squares: string;
  /** The squares in words, for screen readers. */
  squaresLabel: string;
  /** False when the hunt repeats today's puzzle and today is not finished, so its answers stay hidden. */
  open: boolean;
};

export function trailRows(trail: TrailEntry[], today: { puzzle: number; finished: boolean }): TrailRow[] {
  return trail.map((entry) => ({
    entry,
    hunt: hunts[puzzleForDay(entry.dayNumber) - 1],
    squares: entry.hints.map(squareFor).join(''),
    squaresLabel: entry.hints
      .map((hints) => (hints === 0 ? 'no hint' : hints < 3 ? 'with hints' : 'answer shown'))
      .join(', '),
    open: today.finished || entry.puzzle !== today.puzzle,
  }));
}
