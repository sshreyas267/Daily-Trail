import type { Hunt } from '../data/hunts';
import { checkAnswer, normalizeAnswer, scoreStage } from '../engine';

export type Phase = 'idle' | 'playing' | 'stageSolved' | 'finished';

export type StageProgress = {
  hints: number;
  wrong: number;
  points: number;
  secs: number;
  solved: boolean;
};

export type GameState = {
  phase: Phase;
  dayNumber: number;
  puzzle: number;
  stageIndex: number;
  stages: StageProgress[];
  startedAt: number | null;
  stageStartedAt: number | null;
  finishedAt: number | null;
};

export type GameAction =
  | { type: 'start'; now: number }
  | { type: 'submit'; answer: string; now: number }
  | { type: 'hint' }
  | { type: 'advance'; now: number };

const MAX_HINTS = 3;

export function createInitialState(hunt: Hunt, dayNumber: number): GameState {
  return {
    phase: 'idle',
    dayNumber,
    puzzle: hunt.day,
    stageIndex: 0,
    stages: hunt.stages.map(() => ({ hints: 0, wrong: 0, points: 0, secs: 0, solved: false })),
    startedAt: null,
    stageStartedAt: null,
    finishedAt: null,
  };
}

const updateCurrentStage = (state: GameState, change: Partial<StageProgress>): StageProgress[] =>
  state.stages.map((stage, index) => (index === state.stageIndex ? { ...stage, ...change } : stage));

export function createGameReducer(hunt: Hunt) {
  return function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case 'start':
        if (state.phase !== 'idle') return state;
        return { ...state, phase: 'playing', startedAt: action.now, stageStartedAt: action.now };

      case 'hint': {
        if (state.phase !== 'playing') return state;
        const hints = state.stages[state.stageIndex].hints;
        if (hints >= MAX_HINTS) return state;
        return { ...state, stages: updateCurrentStage(state, { hints: hints + 1 }) };
      }

      case 'submit': {
        if (state.phase !== 'playing' || !normalizeAnswer(action.answer)) return state;
        const progress = state.stages[state.stageIndex];
        if (!checkAnswer(hunt.stages[state.stageIndex], action.answer)) {
          return { ...state, stages: updateCurrentStage(state, { wrong: progress.wrong + 1 }) };
        }
        const isLastStage = state.stageIndex === hunt.stages.length - 1;
        return {
          ...state,
          phase: 'stageSolved',
          finishedAt: isLastStage ? action.now : null,
          stages: updateCurrentStage(state, {
            solved: true,
            points: scoreStage(progress.hints),
            secs: Math.round((action.now - (state.stageStartedAt ?? action.now)) / 1000),
          }),
        };
      }

      case 'advance':
        if (state.phase !== 'stageSolved') return state;
        if (state.stageIndex === hunt.stages.length - 1) return { ...state, phase: 'finished' };
        return {
          ...state,
          phase: 'playing',
          stageIndex: state.stageIndex + 1,
          stageStartedAt: action.now,
        };
    }
  };
}
