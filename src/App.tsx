import { useEffect, useMemo, useReducer, useState } from 'react';
import { GameHeader } from './components/GameHeader';
import { Intro } from './components/Intro';
import { Result } from './components/Result';
import { Stage } from './components/Stage';
import { StageFound } from './components/StageFound';
import { applyFinish, toDateKey } from './engine';
import { createGameReducer } from './game/reducer';
import { foundLetters } from './game/selectors';
import { saveGame, saveStreak, type Session } from './game/session';

function DevBanner({ session }: { session: Session }) {
  if (session.mode === 'live') return null;
  return (
    <p className="dev-banner">
      {session.mode === 'day'
        ? `Test view of puzzle ${session.hunt.day}. This play does not count.`
        : `Test date ${session.dateKey}. This is kept apart from your real progress.`}
    </p>
  );
}

export function App({ session }: { session: Session }) {
  const { hunt } = session;
  const reducer = useMemo(() => createGameReducer(hunt), [hunt]);
  const [state, dispatch] = useReducer(reducer, session.initialGame);
  const [streak, setStreak] = useState(session.streak);

  useEffect(() => {
    saveGame(session, state);
  }, [session, state]);

  const finished = state.finishedAt !== null;
  useEffect(() => {
    if (!finished || !streak) return;
    const next = applyFinish(streak, session.dateKey);
    if (next !== streak) {
      setStreak(next);
      saveStreak(session, next);
    }
  }, [finished, streak, session]);

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

  let screen;
  if (state.phase === 'idle') {
    screen = (
      <Intro
        huntNumber={state.dayNumber}
        dateKey={session.dateKey}
        streak={streak}
        streakChange={session.streakChange}
        onStart={() => dispatch({ type: 'start', now: Date.now() })}
      />
    );
  } else if (state.phase === 'finished') {
    screen = <Result hunt={hunt} state={state} streak={streak} />;
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
    </>
  );
}
