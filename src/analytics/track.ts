import type { Store } from '../storage';

export type EventProps = {
  hunt_viewed: { streak: number; is_new_player: boolean; days_since_last: number | null };
  hunt_started: Record<string, never>;
  stage_viewed: { stage: number; type: string };
  answer_wrong: { stage: number; tries: number };
  hint_used: { stage: number; hint: number; cost: number };
  stage_completed: { stage: number; hints: number; wrong: number; points: number; secs: number };
  hunt_completed: { score: number; secs: number; hints: number; wrong: number; streak: number };
  hunt_abandoned: { last_stage: number; secs: number };
  share_copied: { score: number; method: string };
  streak_freeze_used: { streak: number; freezes_left: number };
  streak_broken: { previous_streak: number };
};

export type EventName = keyof EventProps;

export type AnalyticsEvent<N extends EventName = EventName> = {
  name: N;
  player_id: string;
  session_id: string;
  hunt: number;
  puzzle: number;
  ts: number;
  dev?: true;
  props: EventProps[N];
};

export type Track = <N extends EventName>(name: N, props: EventProps[N]) => void;

export const MAX_EVENTS = 5000;
const EVENTS_KEY = 'events';
const PLAYER_KEY = 'player_id';

export function newId(): string {
  const random = globalThis.crypto;
  // randomUUID exists only on https and localhost, so a phone on a local network needs the fallback.
  if (random?.randomUUID) return random.randomUUID();
  return Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 10).padEnd(8, '0')).join('-');
}

type TrackerOptions = {
  store: Store;
  hunt: number;
  puzzle: number;
  dev: boolean;
  now?: () => number;
};

export function createTracker({ store, hunt, puzzle, dev, now = Date.now }: TrackerOptions) {
  let playerId = store.load<string>(PLAYER_KEY);
  if (!playerId) {
    playerId = newId();
    store.save(PLAYER_KEY, playerId);
  }
  const player_id = playerId;
  const session_id = newId();
  let events = store.load<AnalyticsEvent[]>(EVENTS_KEY) ?? [];

  const track: Track = (name, props) => {
    const event = {
      name,
      player_id,
      session_id,
      hunt,
      puzzle,
      ts: now(),
      ...(dev ? { dev: true as const } : {}),
      props,
    } as AnalyticsEvent;
    events = [...events, event].slice(-MAX_EVENTS);
    store.save(EVENTS_KEY, events);
  };

  return { track, getEvents: () => events };
}

let tracker: ReturnType<typeof createTracker> | null = null;

export function initAnalytics(options: TrackerOptions): void {
  tracker = createTracker(options);
}

/** Every user action in the game is recorded through this function. */
export const track: Track = (name, props) => tracker?.track(name, props);

export const getEvents = (): AnalyticsEvent[] => tracker?.getEvents() ?? [];
