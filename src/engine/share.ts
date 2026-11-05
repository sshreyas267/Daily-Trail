import { formatTime } from '../game/selectors';

const GREEN = '🟩';
const YELLOW = '🟨';
const BLACK = '⬛';

/** Green for no hint, yellow for one or two hints, black when the answer was shown. */
export function squareFor(hintsUsed: number): string {
  if (hintsUsed === 0) return GREEN;
  return hintsUsed < 3 ? YELLOW : BLACK;
}

type ShareInput = {
  dayNumber: number;
  stageHints: number[];
  secs: number;
  /** Null when the play has no streak, as under ?day=N. */
  streak: number | null;
  url: string;
};

/** Spoiler free: never includes an answer, a letter or the treasure word. */
export function buildShareText({ dayNumber, stageHints, secs, streak, url }: ShareInput): string {
  const time = `Time ${formatTime(secs)}.`;
  return [
    `Daily Trail #${dayNumber}`,
    stageHints.map(squareFor).join(''),
    'Treasure found',
    streak === null ? time : `${time} Streak ${streak}.`,
    url,
  ].join('\n');
}
