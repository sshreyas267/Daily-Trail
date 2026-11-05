export const STAGE_POINTS = 100;

/** Total points lost after taking 0, 1, 2 or 3 hints. */
const HINT_PENALTY = [0, 15, 40, 80] as const;

export const HINT_COST = [15, 25, 40] as const;

export function scoreStage(hintsUsed: number): number {
  const hints = Math.min(Math.max(Math.trunc(hintsUsed), 0), 3);
  return STAGE_POINTS - HINT_PENALTY[hints];
}
