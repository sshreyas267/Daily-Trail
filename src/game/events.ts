import type { Track } from '../analytics';
import type { Hunt } from '../data/hunts';
import { HINT_COST } from '../engine';
import type { GameAction, GameState } from './reducer';
import { elapsedSecs, totalHints, totalScore, totalWrong } from './selectors';

/** Fires the events for one game action. Called once per action, never from an effect. */
export function trackTransition(
  hunt: Hunt,
  previous: GameState,
  next: GameState,
  action: GameAction,
  streak: number,
  track: Track,
): void {
  if (next === previous) return;
  const stage = next.stageIndex + 1;

  const viewStage = () =>
    track('stage_viewed', { stage, type: hunt.stages[next.stageIndex].type });

  switch (action.type) {
    case 'start':
      track('hunt_started', {});
      viewStage();
      return;

    case 'hint': {
      const hint = next.stages[next.stageIndex].hints;
      track('hint_used', { stage, hint, cost: HINT_COST[hint - 1] });
      return;
    }

    case 'submit': {
      const progress = next.stages[next.stageIndex];
      if (!progress.solved) {
        track('answer_wrong', { stage, tries: progress.wrong });
        return;
      }
      track('stage_completed', {
        stage,
        hints: progress.hints,
        wrong: progress.wrong,
        points: progress.points,
        secs: progress.secs,
      });
      if (next.finishedAt !== null) {
        track('hunt_completed', {
          score: totalScore(next),
          secs: elapsedSecs(next, action.now),
          hints: totalHints(next),
          wrong: totalWrong(next),
          streak,
        });
      }
      return;
    }

    case 'advance':
      if (next.phase === 'playing') viewStage();
      return;
  }
}
