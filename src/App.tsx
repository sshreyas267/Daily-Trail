import { useMemo, useReducer } from 'react';
import { GameHeader } from './components/GameHeader';
import { Intro } from './components/Intro';
import { Result } from './components/Result';
import { Stage } from './components/Stage';
import { StageFound } from './components/StageFound';
import { hunts } from './data/hunts';
import { createGameReducer, createInitialState } from './game/reducer';
import { foundLetters } from './game/selectors';

const hunt = hunts[0];
const DAY_NUMBER = 1;

export function App() {
  const reducer = useMemo(() => createGameReducer(hunt), []);
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState(hunt, DAY_NUMBER));

  const stage = hunt.stages[state.stageIndex];
  const progress = state.stages[state.stageIndex];
  const letters = foundLetters(hunt, state);

  if (state.phase === 'idle') {
    return <Intro huntNumber={state.dayNumber} onStart={() => dispatch({ type: 'start', now: Date.now() })} />;
  }

  if (state.phase === 'finished') {
    return <Result hunt={hunt} state={state} />;
  }

  return (
    <>
      <GameHeader state={state} letters={letters} />
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
