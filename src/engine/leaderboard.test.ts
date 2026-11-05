import { describe, expect, it } from 'vitest';
import { buildLeaderboard, samplePlayer, SAMPLE_PLAYER_COUNT } from './leaderboard';

const you = { name: 'You', score: 200, secs: 100 };
const samples = (day: number) => buildLeaderboard(day, you).filter((row) => !row.isPlayer);

describe('leaderboard', () => {
  it('has twelve sample players plus the player', () => {
    const rows = buildLeaderboard(3, you);
    expect(rows).toHaveLength(SAMPLE_PLAYER_COUNT + 1);
    expect(rows.filter((row) => row.isPlayer)).toHaveLength(1);
  });

  it('gives the same result every time for the same day', () => {
    expect(buildLeaderboard(5, you)).toEqual(buildLeaderboard(5, you));
    expect(samplePlayer(5, 3)).toEqual(samplePlayer(5, 3));
  });

  it('changes from day to day, including when the puzzle repeats', () => {
    expect(samples(1)).not.toEqual(samples(2));
    expect(samples(1)).not.toEqual(samples(8));
  });

  it('uses unique names and possible scores on every day', () => {
    for (let day = 1; day <= 60; day++) {
      const rows = samples(day);
      expect(new Set(rows.map((row) => row.name)).size).toBe(SAMPLE_PLAYER_COUNT);
      for (const row of rows) {
        expect(row.score % 5).toBe(0);
        expect(row.score).toBeGreaterThanOrEqual(60);
        expect(row.score).toBeLessThanOrEqual(300);
        expect(row.secs).toBeGreaterThanOrEqual(45);
      }
    }
  });

  it('ranks by score, then by the faster time', () => {
    for (let day = 1; day <= 30; day++) {
      const rows = buildLeaderboard(day, you);
      rows.forEach((row, index) => {
        expect(row.rank).toBe(index + 1);
        const next = rows[index + 1];
        if (next) {
          expect(row.score).toBeGreaterThanOrEqual(next.score);
          if (row.score === next.score) expect(row.secs).toBeLessThanOrEqual(next.secs);
        }
      });
    }
  });

  it('places the player below any higher score and above any lower score', () => {
    const rows = buildLeaderboard(7, you);
    const playerIndex = rows.findIndex((row) => row.isPlayer);
    rows.slice(0, playerIndex).forEach((row) => expect(row.score).toBeGreaterThanOrEqual(200));
    rows.slice(playerIndex + 1).forEach((row) => expect(row.score).toBeLessThanOrEqual(200));
  });

  it('places a player with a few hints mid-table, and a clean solve near the top', () => {
    const medianRank = (score: number) => {
      const ranks = Array.from({ length: 101 }, (_, day) =>
        buildLeaderboard(day + 1, { name: 'You', score, secs: 150 }).find((row) => row.isPlayer)!.rank,
      ).sort((a, b) => a - b);
      return ranks[50];
    };
    expect(medianRank(205)).toBeGreaterThanOrEqual(5);
    expect(medianRank(205)).toBeLessThanOrEqual(9);
    expect(medianRank(300)).toBeLessThanOrEqual(2);
  });

  it('puts the player first on a perfect score and fastest time', () => {
    expect(buildLeaderboard(7, { name: 'You', score: 300, secs: 1 })[0].isPlayer).toBe(true);
  });
});
