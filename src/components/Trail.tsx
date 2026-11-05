import { track } from '../analytics';
import { formatDate, formatTime } from '../game/selectors';
import type { TrailRow } from '../game/trail';

const STAGE_LABEL = { riddle: 'Riddle', cipher: 'Cipher', pattern: 'Pattern' } as const;

/** The daily hunts this player has finished, to look back at or play again. */
export function Trail({ rows }: { rows: TrailRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="trail" aria-labelledby="trail-title">
      <h2 id="trail-title" className="subheading">
        Your past hunts
      </h2>
      <p className="muted">Look back at the answers, or play a hunt again. Replays never change your streak or score.</p>
      <ul className="trail-list">
        {rows.map(({ entry, hunt, squares, squaresLabel, open }) => (
          <li key={entry.dayNumber} className="trail-item">
            <p className="trail-title">
              <strong>Hunt #{entry.dayNumber}</strong>
              <span className="muted">{formatDate(entry.dateKey, false)}</span>
            </p>
            <p className="trail-stats">
              <span role="img" aria-label={squaresLabel}>
                {squares}
              </span>
              <span>Score {entry.score}</span>
              <span>Time {formatTime(entry.secs)}</span>
            </p>
            {open ? (
              <>
                <details
                  className="trail-answers"
                  onToggle={(event) => {
                    if (event.currentTarget.open) track('trail_answers_viewed', { day: entry.dayNumber });
                  }}
                >
                  <summary>View answers</summary>
                  <dl>
                    <div>
                      <dt>Treasure word</dt>
                      <dd>{hunt.word}</dd>
                    </div>
                    {hunt.stages.map((stage) => (
                      <div key={stage.type}>
                        <dt>{STAGE_LABEL[stage.type]}</dt>
                        <dd>{stage.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
                <a
                  className="button button-secondary"
                  href={`?replay=${entry.dayNumber}`}
                  onClick={() => track('practice_opened', { kind: 'replay', target: entry.dayNumber })}
                >
                  Play Hunt #{entry.dayNumber} again
                </a>
              </>
            ) : (
              <p className="muted">This is today's puzzle again. Finish today's hunt to see it.</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
