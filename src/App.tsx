import { useEffect, useMemo, useRef, useState } from 'react';
import { track } from './analytics';
import { EventLog } from './components/EventLog';
import { GameHeader } from './components/GameHeader';
import { Intro } from './components/Intro';
import { Result } from './components/Result';
import { Stage } from './components/Stage';
import { StageFound } from './components/StageFound';
import { applyFinish, toDateKey } from './engine';
import { trackTransition } from './game/events';
import { createGameReducer, type GameAction } from './game/reducer';
import { elapsedSecs, foundLetters } from './game/selectors';
import { isRealPlay, saveGame, saveStreak, saveTrail, type Session } from './game/session';
import { addToTrail, trailEntryFor, trailRows } from './game/trail';

const BANNER: Record<Exclude<Session['mode'], 'live'>, (session: Session) => string> = {
  day: (session) => `Test view of puzzle ${session.hunt.day}. This play does not count.`,
  date: (session) => `Test date ${session.dateKey}. This is kept apart from your real progress.`,
  practice: (session) => `Practice hunt ${session.dayNumber}. This play does not count.`,
  replay: (session) => `Replay of Hunt #${session.dayNumber}. This play does not count.`,
};

function DevBanner({ session }: { session: Session }) {
  if (session.mode === 'live') return null;
  return <aside className="dev-banner">{BANNER[session.mode](session)}</aside>;
}

function introLabel(session: Session): string {
  if (session.mode === 'practice') return `Practice hunt ${session.dayNumber}`;
  if (session.mode === 'replay') return `Replay of Hunt #${session.dayNumber}`;
  return `Hunt #${session.dayNumber}`;
}

export function App({ session }: { session: Session }) {
  const { hunt } = session;
  const reducer = useMemo(() => createGameReducer(hunt), [hunt]);
  const [state, setState] = useState(session.initialGame);
  const [streak, setStreak] = useState(session.streak);
  const [trail, setTrail] = useState(session.trail);

  useEffect(() => {
    saveGame(session, state);
  }, [session, state]);

  const dispatch = (action: GameAction) => {
    const next = reducer(state, action);
    let nextStreak = streak;
    if (next.finishedAt !== null && state.finishedAt === null && streak) {
      nextStreak = applyFinish(streak, session.dateKey);
      setStreak(nextStreak);
      saveStreak(session, nextStreak);
    }
    if (next.finishedAt !== null && state.finishedAt === null && isRealPlay(session.mode)) {
      const nextTrail = addToTrail(trail, trailEntryFor(next, session.dateKey));
      setTrail(nextTrail);
      saveTrail(session, nextTrail);
    }
    setState(next);
    trackTransition(hunt, state, next, action, nextStreak?.count ?? 0, track);
  };

  // Hiding the page also happens when someone switches apps and comes back, so this
  // is only a signal of where they stopped, sent at most once per session.
  const latestState = useRef(state);
  latestState.current = state;
  const abandonSent = useRef(false);
  useEffect(() => {
    const onHide = () => {
      const current = latestState.current;
      if (document.visibilityState !== 'hidden' || abandonSent.current) return;
      if (current.startedAt === null || current.finishedAt !== null) return;
      abandonSent.current = true;
      track('hunt_abandoned', {
        last_stage: current.stageIndex + 1,
        secs: elapsedSecs(current, Date.now()),
      });
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  // A phone can bring back an old tab without reloading it. Show the new day's hunt,
  // unless a hunt is being played right now.
  const between = state.phase === 'idle' || state.phase === 'finished';
  useEffect(() => {
    if (session.mode !== 'live' || !between) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible' && toDateKey(new Date()) !== session.dateKey) {
        window.location.reload();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [session, between]);

  const stage = hunt.stages[state.stageIndex];
  const progress = state.stages[state.stageIndex];

  const rows = trailRows(trail, { puzzle: hunt.day, finished: state.phase === 'finished' });

  let screen;
  if (state.phase === 'idle') {
    screen = (
      <Intro
        label={introLabel(session)}
        dateKey={session.dateKey}
        streak={streak}
        streakChange={session.streakChange}
        trail={rows}
        onStart={() => dispatch({ type: 'start', now: Date.now() })}
      />
    );
  } else if (state.phase === 'finished') {
    screen = (
      <Result
        hunt={hunt}
        state={state}
        streak={streak}
        daily={session.mode !== 'practice' && session.mode !== 'replay'}
        practising={!isRealPlay(session.mode)}
        currentPractice={session.mode === 'practice' ? session.dayNumber : null}
        trail={rows}
      />
    );
  } else {
    screen = (
      <>
        <GameHeader state={state} letters={foundLetters(hunt, state)} />
        {state.phase === 'playing' ? (
          <Stage
            key={state.stageIndex}
            stage={stage}
            stageNumber={state.stageIndex + 1}
            stageCount={hunt.stages.length}
            progress={progress}
            onSubmit={(answer) => dispatch({ type: 'submit', answer, now: Date.now() })}
            onHint={() => dispatch({ type: 'hint' })}
          />
        ) : (
          <StageFound
            key={state.stageIndex}
            answer={stage.answer}
            letter={stage.answer[0]}
            points={progress.points}
            isLastStage={state.stageIndex === hunt.stages.length - 1}
            onContinue={() => dispatch({ type: 'advance', now: Date.now() })}
          />
        )}
      </>
    );
  }

  return (
    <>
      <DevBanner session={session} />
      {screen}
      <EventLog />
    </>
  );
}
