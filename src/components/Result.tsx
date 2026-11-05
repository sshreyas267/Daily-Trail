import { useEffect, useRef } from 'react';
import type { Hunt } from '../data/hunts';
import { formatTime, totalHints, totalScore, totalWrong, elapsedSecs } from '../game/selectors';
import type { GameState } from '../game/reducer';
import { Chest } from './Chest';

type Props = { hunt: Hunt; state: GameState };

const STAGE_LABEL = { riddle: 'Riddle', cipher: 'Cipher', pattern: 'Pattern' } as const;

export function Result({ hunt, state }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="screen screen-center">
      <Chest />
      <h1 ref={headingRef} className="heading" tabIndex={-1}>
        Treasure found
      </h1>
      <div className="slots" role="img" aria-label={`The treasure word is ${hunt.word}`}>
        {hunt.word.split('').map((letter, index) => (
          <span key={index} className="tile slot slot-found">
            {letter}
          </span>
        ))}
      </div>

      <dl className="stats">
        <div>
          <dt>Score</dt>
          <dd>
            {totalScore(state)}/{hunt.stages.length * 100}
          </dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatTime(elapsedSecs(state, Date.now()))}</dd>
        </div>
        <div>
          <dt>Hints</dt>
          <dd>{totalHints(state)}</dd>
        </div>
        <div>
          <dt>Wrong</dt>
          <dd>{totalWrong(state)}</dd>
        </div>
      </dl>

      <table className="stage-table">
        <caption className="visually-hidden">Points for each stage</caption>
        <tbody>
          {hunt.stages.map((stage, index) => (
            <tr key={stage.type}>
              <th scope="row">{STAGE_LABEL[stage.type]}</th>
              <td>{state.stages[index].points} points</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="placeholder" aria-label="Share card">
        <h2 className="subheading">Share card</h2>
        <p className="muted">Sharing is not ready yet.</p>
      </section>
      <section className="placeholder" aria-label="Leaderboard">
        <h2 className="subheading">Leaderboard</h2>
        <p className="muted">The leaderboard is not ready yet.</p>
      </section>
    </main>
  );
}
