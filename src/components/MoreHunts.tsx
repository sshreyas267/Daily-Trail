import { track } from '../analytics';
import { PRACTICE_COUNT } from '../data/hunts';

type Props = {
  /** The practice hunt on screen, if this is one. */
  currentPractice: number | null;
  /** True for plays that never count, which get a way back to today's hunt. */
  showBack: boolean;
};

const PRACTICE = Array.from({ length: PRACTICE_COUNT }, (_, index) => index + 1);

/** Practice hunts are separate from the daily hunts, so playing them never spoils a future day. */
export function MoreHunts({ currentPractice, showBack }: Props) {
  return (
    <section className="more-hunts" aria-labelledby="more-hunts-title">
      <h2 id="more-hunts-title" className="subheading">
        Play more hunts
      </h2>
      <p className="muted">
        Try a practice hunt now, or come back tomorrow for a new daily hunt. Practice hunts never change your streak or
        score.
      </p>
      <ul className="more-hunts-list">
        {PRACTICE.map((number) => (
          <li key={number}>
            <a
              className="button button-secondary"
              href={`?practice=${number}`}
              aria-current={number === currentPractice ? 'page' : undefined}
              onClick={() => track('practice_opened', { kind: 'practice', target: number })}
            >
              Practice hunt {number}
              {number === currentPractice && ' (this one)'}
            </a>
          </li>
        ))}
      </ul>
      {showBack && (
        <a className="button" href="./">
          Back to today's hunt
        </a>
      )}
    </section>
  );
}
