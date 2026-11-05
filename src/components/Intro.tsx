import type { StreakChange, StreakState } from '../engine';

type Props = {
  huntNumber: number;
  dateKey: string;
  streak: StreakState | null;
  streakChange: StreakChange | null;
  onStart: () => void;
};

function formatDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const dayWord = (count: number) => (count === 1 ? 'day' : 'days');

export function Intro({ huntNumber, dateKey, streak, streakChange, onStart }: Props) {
  return (
    <main className="screen screen-center">
      <h1 className="wordmark">Daily Trail</h1>
      <p className="muted">
        {formatDate(dateKey)}. Hunt #{huntNumber}.
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
    </main>
  );
}
