import type { GameState } from '../game/reducer';
import { LetterSlots } from './LetterSlots';
import { Timer } from './Timer';

type Props = { state: GameState; letters: (string | null)[] };

export function GameHeader({ state, letters }: Props) {
  return (
    <header className="game-header">
      <div className="game-header-row">
        <span className="wordmark wordmark-small">Daily Trail</span>
        <Timer state={state} />
      </div>
      <LetterSlots letters={letters} />
    </header>
  );
}
