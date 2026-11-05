export type LeaderboardRow = { name: string; score: number; secs: number; isPlayer: boolean; rank: number };

export const SAMPLE_PLAYER_COUNT = 12;

const NAMES = [
  'TideReader', 'OldSalt', 'CompassRose', 'InkTrail', 'LanternBay', 'MapMender', 'QuietHarbor', 'RiddleFox',
  'CoralCode', 'NorthStar', 'DriftwoodDan', 'PuzzlePearl', 'SandDollar', 'GaleForce', 'KeyKeeper', 'BrassBell',
];

/** Small seeded random number generator (mulberry32). */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/** Points for one stage, weighted towards solving with few hints. */
function samplePoints(roll: number): number {
  if (roll < 0.5) return 100;
  if (roll < 0.78) return 85;
  if (roll < 0.94) return 60;
  return 20;
}

/** Depends only on the day number and the player index, so it never changes on reload. */
export function samplePlayer(dayNumber: number, index: number): Omit<LeaderboardRow, 'isPlayer' | 'rank'> {
  const random = seededRandom(dayNumber * 1000 + index);
  const score = samplePoints(random()) + samplePoints(random()) + samplePoints(random());
  const secs = 45 + Math.floor(random() * random() * 540);
  return { name: NAMES[(index + dayNumber) % NAMES.length], score, secs };
}

/** Sample players plus the real player, ranked by score, then by the faster time. */
export function buildLeaderboard(
  dayNumber: number,
  player: { name: string; score: number; secs: number },
): LeaderboardRow[] {
  const rows = [
    ...Array.from({ length: SAMPLE_PLAYER_COUNT }, (_, index) => ({
      ...samplePlayer(dayNumber, index),
      isPlayer: false,
    })),
    { ...player, isPlayer: true },
  ];
  return rows
    .sort((a, b) => b.score - a.score || a.secs - b.secs || Number(b.isPlayer) - Number(a.isPlayer))
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
