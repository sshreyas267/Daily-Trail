import { useEffect, useRef } from 'react';
import type { Hunt } from '../data/hunts';
import { buildLeaderboard, buildShareText, type StreakState } from '../engine';
import { formatTime, totalHints, totalScore, totalWrong, elapsedSecs } from '../game/selectors';
import type { GameState } from '../game/reducer';
import { Chest } from './Chest';
import { Leaderboard } from './Leaderboard';
import { ShareCard } from './ShareCard';

type Props = { hunt: Hunt; state: GameState; streak: StreakState | null };

const STAGE_LABEL = { riddle: 'Riddle', cipher: 'Cipher', pattern: 'Pattern' } as const;

export function Result({ hunt, state, streak }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const score = totalScore(state);
  const secs = elapsedSecs(state, Date.now());
  const shareText = buildShareText({
    dayNumber: state.dayNumber,
    stageHints: state.stages.map((stage) => stage.hints),
    secs,
    streak: streak?.count ?? null,
    url: `${window.location.origin}/`,
  });

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
            {score}/{hunt.stages.length * 100}
          </dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatTime(secs)}</dd>
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

      {streak && (
        <p className="streak-line">
          Streak: {streak.count} {streak.count === 1 ? 'day' : 'days'}. Come back tomorrow for a new hunt.
        </p>
      )}

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

      <ShareCard text={shareText} score={score} />
      <Leaderboard rows={buildLeaderboard(state.dayNumber, { name: 'You', score, secs })} />
    </main>
  );
}
