import type { Hunt } from '../data/hunts';
import type { GameState } from './reducer';

export const totalScore = (state: GameState): number =>
  state.stages.reduce((sum, stage) => sum + stage.points, 0);

export const totalHints = (state: GameState): number =>
  state.stages.reduce((sum, stage) => sum + stage.hints, 0);

export const totalWrong = (state: GameState): number =>
  state.stages.reduce((sum, stage) => sum + stage.wrong, 0);

export const elapsedSecs = (state: GameState, now: number): number => {
  if (state.startedAt === null) return 0;
  return Math.max(0, Math.floor(((state.finishedAt ?? now) - state.startedAt) / 1000));
};

/** One entry per stage: the found letter, or null while it is still hidden. */
export const foundLetters = (hunt: Hunt, state: GameState): (string | null)[] =>
  hunt.stages.map((stage, index) => (state.stages[index].solved ? stage.answer[0] : null));

export const formatTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60);
  return `${minutes}:${String(secs % 60).padStart(2, '0')}`;
};
