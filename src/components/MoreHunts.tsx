import { track } from '../analytics';
import { HUNT_COUNT } from '../engine';

type Props = { puzzle: number; practising: boolean };

const PUZZLES = Array.from({ length: HUNT_COUNT }, (_, index) => index + 1);

/** Links to every hunt as a practice play. Practice plays never touch the real streak, score or daily lock. */
export function MoreHunts({ puzzle, practising }: Props) {
  return (
    <section className="more-hunts" aria-labelledby="more-hunts-title">
      <h2 id="more-hunts-title" className="subheading">
        Play more hunts
      </h2>
      <p className="muted">
        Play any of the seven hunts now, or come back tomorrow for a new one. Practice plays do not change your
        streak, score or today's result.
      </p>
      <ul className="more-hunts-list">
        {PUZZLES.map((number) => (
          <li key={number}>
            <a
              className="button button-secondary"
              href={`?day=${number}`}
              aria-current={number === puzzle ? 'page' : undefined}
              onClick={() => track('practice_opened', { puzzle: number })}
            >
              Puzzle {number}
              {number === puzzle && <span className="visually-hidden"> (this one)</span>}
            </a>
          </li>
        ))}
      </ul>
      {practising && (
        <a className="button" href="./">
          Back to today's hunt
        </a>
      )}
    </section>
  );
}
