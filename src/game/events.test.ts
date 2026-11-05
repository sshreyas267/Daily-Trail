import { describe, expect, it } from 'vitest';
import type { Track } from '../analytics';
import { hunts } from '../data/hunts';
import { trackTransition } from './events';
import { createGameReducer, createInitialState, type GameAction, type GameState } from './reducer';

const hunt = hunts[0];
const reducer = createGameReducer(hunt);
const T0 = 1_000_000;

function run(actions: GameAction[], streak = 3) {
  const fired: { name: string; props: unknown }[] = [];
  const spy: Track = (name, props) => void fired.push({ name, props });
  let state: GameState = createInitialState(hunt, 1);
  for (const action of actions) {
    const next = reducer(state, action);
    trackTransition(hunt, state, next, action, streak, spy);
    state = next;
  }
  return fired;
}

const start: GameAction = { type: 'start', now: T0 };
const submit = (answer: string, secs: number): GameAction => ({ type: 'submit', answer, now: T0 + secs * 1000 });
const advance = (secs: number): GameAction => ({ type: 'advance', now: T0 + secs * 1000 });

describe('trackTransition', () => {
  it('produces the expected sequence for a full hunt with two hints and one wrong answer', () => {
    const fired = run([
      start,
      submit('banana', 5),
      submit('sponge', 10),
      advance(12),
      { type: 'hint' },
      submit('emerald', 42),
      advance(44),
      { type: 'hint' },
      submit('august', 64),
      advance(70),
    ]);
    expect(fired).toEqual([
      { name: 'hunt_started', props: {} },
      { name: 'stage_viewed', props: { stage: 1, type: 'riddle' } },
      { name: 'answer_wrong', props: { stage: 1, tries: 1 } },
      { name: 'stage_completed', props: { stage: 1, hints: 0, wrong: 1, points: 100, secs: 10 } },
      { name: 'stage_viewed', props: { stage: 2, type: 'cipher' } },
      { name: 'hint_used', props: { stage: 2, hint: 1, cost: 15 } },
      { name: 'stage_completed', props: { stage: 2, hints: 1, wrong: 0, points: 85, secs: 30 } },
      { name: 'stage_viewed', props: { stage: 3, type: 'pattern' } },
      { name: 'hint_used', props: { stage: 3, hint: 1, cost: 15 } },
      { name: 'stage_completed', props: { stage: 3, hints: 1, wrong: 0, points: 85, secs: 20 } },
      { name: 'hunt_completed', props: { score: 270, secs: 64, hints: 2, wrong: 1, streak: 3 } },
    ]);
  });

  it('records the cost of each hint', () => {
    const fired = run([start, { type: 'hint' }, { type: 'hint' }, { type: 'hint' }]);
    expect(fired.slice(2).map((event) => event.props)).toEqual([
      { stage: 1, hint: 1, cost: 15 },
      { stage: 1, hint: 2, cost: 25 },
      { stage: 1, hint: 3, cost: 40 },
    ]);
  });

  it('fires nothing for an action that changes nothing', () => {
    const fired = run([
      submit('sponge', 1), // not started yet
      start,
      submit('   ', 2), // empty answer
      { type: 'hint' },
      { type: 'hint' },
      { type: 'hint' },
      { type: 'hint' }, // no fourth hint
    ]);
    expect(fired.map((event) => event.name)).toEqual([
      'hunt_started',
      'stage_viewed',
      'hint_used',
      'hint_used',
      'hint_used',
    ]);
  });

  it('counts tries upward on repeated wrong answers', () => {
    const fired = run([start, submit('x', 1), submit('y', 2)]);
    expect(fired.slice(2).map((event) => event.props)).toEqual([
      { stage: 1, tries: 1 },
      { stage: 1, tries: 2 },
    ]);
  });

  it('does not fire a stage view after the last stage', () => {
    const fired = run([
      start,
      submit('sponge', 1),
      advance(2),
      submit('emerald', 3),
      advance(4),
      submit('aug', 5),
      advance(6),
    ]);
    expect(fired.filter((event) => event.name === 'stage_viewed')).toHaveLength(3);
    expect(fired.at(-1)?.name).toBe('hunt_completed');
  });
});
