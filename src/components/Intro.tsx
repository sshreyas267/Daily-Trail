import type { StreakChange, StreakState } from '../engine';
import { formatDate } from '../game/selectors';
import type { TrailRow } from '../game/trail';
import { Trail } from './Trail';

type Props = {
  /** What the line under the wordmark calls this hunt. */
  label: string;
  dateKey: string;
  streak: StreakState | null;
  streakChange: StreakChange | null;
  trail: TrailRow[];
  onStart: () => void;
};

const dayWord = (count: number) => (count === 1 ? 'day' : 'days');

export function Intro({ label, dateKey, streak, streakChange, trail, onStart }: Props) {
  return (
    <main className="screen screen-center">
      <h1 className="wordmark">Daily Trail</h1>
      <p className="muted">
        {formatDate(dateKey)}. {label}.
      </p>
      {streakChange?.type === 'freeze_used' && (
        <p className="muted">Your freeze covered the day you missed, so your streak is safe.</p>
      )}
      {streakChange?.type === 'broken' && (
        <p className="muted">
          Your streak of {streakChange.previous_streak} {dayWord(streakChange.previous_streak)} ended. Start a new one
          today.
        </p>
      )}
      {streak && streak.count > 0 && (
        <p className="streak-line">
          Streak: {streak.count} {dayWord(streak.count)}. {streak.freezes > 0 ? 'Freeze ready.' : 'Freeze used this week.'}
        </p>
      )}
      <p className="lede">Solve three puzzles. Each answer gives you one letter of the treasure word.</p>
      <ol className="rules">
        <li>Solve a riddle, a cipher and a pattern.</li>
        <li>Each stage is worth 100 points. Hints cost points, and wrong answers cost nothing.</li>
        <li>The timer starts when you press Start.</li>
      </ol>
      <button className="button" type="button" onClick={onStart}>
        Start
      </button>
      <Trail rows={trail} />
    </main>
  );
}
