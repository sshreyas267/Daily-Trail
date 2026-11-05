import { describe, expect, it } from 'vitest';
import { HINT_COST, scoreStage } from './scoring';

describe('scoreStage', () => {
  it.each([
    [0, 100],
    [1, 85],
    [2, 60],
    [3, 20],
  ])('after %i hints scores %i', (hints, points) => {
    expect(scoreStage(hints)).toBe(points);
  });

  it('never goes outside the valid hint range', () => {
    expect(scoreStage(-1)).toBe(100);
    expect(scoreStage(9)).toBe(20);
  });

  it('matches the cost of each hint', () => {
    expect(HINT_COST).toEqual([15, 25, 40]);
    HINT_COST.forEach((cost, index) => {
      expect(scoreStage(index) - scoreStage(index + 1)).toBe(cost);
    });
  });
});
