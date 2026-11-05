import { useEffect, useState } from 'react';
import { elapsedSecs, formatTime } from '../game/selectors';
import type { GameState } from '../game/reducer';

export function Timer({ state }: { state: GameState }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const secs = elapsedSecs(state, now);
  return (
    <span className="timer" role="timer" aria-label={`Time ${formatTime(secs)}`}>
      {formatTime(secs)}
    </span>
  );
}
