import { describe, expect, it } from 'vitest';
import { createMemoryBackend, createStore } from '../storage';
import { createTracker, MAX_EVENTS, type EventName, type EventProps } from './track';

const setup = (dev = false, backend = createMemoryBackend()) =>
  createTracker({ store: createStore('live', backend), hunt: 8, puzzle: 1, dev, now: () => 1234 });

/** One valid payload for every event in reference/events.md. */
const PAYLOADS: { [N in EventName]: EventProps[N] } = {
  hunt_viewed: { streak: 2, is_new_player: false, days_since_last: 1 },
  hunt_started: {},
  stage_viewed: { stage: 1, type: 'riddle' },
  answer_wrong: { stage: 1, tries: 2 },
  hint_used: { stage: 2, hint: 1, cost: 15 },
  stage_completed: { stage: 2, hints: 1, wrong: 0, points: 85, secs: 30 },
  hunt_completed: { score: 245, secs: 90, hints: 3, wrong: 1, streak: 4 },
  hunt_abandoned: { last_stage: 2, secs: 40 },
  share_copied: { score: 245, method: 'copy' },
  practice_opened: { puzzle: 3 },
  streak_freeze_used: { streak: 3, freezes_left: 0 },
  streak_broken: { previous_streak: 5 },
};

describe('track', () => {
  it.each(Object.entries(PAYLOADS))('records %s with the common fields and its properties', (name, props) => {
    const { track, getEvents } = setup();
    track(name as EventName, props as never);
    const [event] = getEvents();
    expect(event).toMatchObject({ name, hunt: 8, puzzle: 1, ts: 1234, props });
    expect(event.player_id).toBeTruthy();
    expect(event.session_id).toBeTruthy();
    expect(event).not.toHaveProperty('dev');
  });

  it('covers all twelve events in the schema', () => {
    expect(Object.keys(PAYLOADS)).toHaveLength(12);
  });

  it('marks test events as dev', () => {
    const { track, getEvents } = setup(true);
    track('hunt_started', {});
    expect(getEvents()[0].dev).toBe(true);
  });

  it('keeps the player id across visits and gives each visit a new session id', () => {
    const backend = createMemoryBackend();
    const first = setup(false, backend);
    first.track('hunt_started', {});
    const second = setup(false, backend);
    second.track('hunt_started', {});
    const [a, b] = second.getEvents();
    expect(a.player_id).toBe(b.player_id);
    expect(a.session_id).not.toBe(b.session_id);
  });

  it('keeps events under one key across visits', () => {
    const backend = createMemoryBackend();
    setup(false, backend).track('hunt_started', {});
    expect(setup(false, backend).getEvents()).toHaveLength(1);
    expect(backend.getItem('daily-trail:live:events')).toContain('hunt_started');
  });

  it('caps the log and keeps the newest events', () => {
    const { track, getEvents } = setup();
    for (let tries = 1; tries <= MAX_EVENTS + 5; tries++) track('answer_wrong', { stage: 1, tries });
    const events = getEvents() as { props: { tries: number } }[];
    expect(events).toHaveLength(MAX_EVENTS);
    expect(events[0].props.tries).toBe(6);
    expect(events.at(-1)?.props.tries).toBe(MAX_EVENTS + 5);
  });
});
