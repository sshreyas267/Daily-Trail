import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cipherHowTo, type CipherStage, type Stage as StageData } from '../data/hunts';
import { HINT_COST, scoreStage } from '../engine';
import type { StageProgress } from '../game/reducer';

type Props = {
  stage: StageData;
  stageNumber: number;
  stageCount: number;
  progress: StageProgress;
  onSubmit: (answer: string) => void;
  onHint: () => void;
};

const STAGE_LABEL = { riddle: 'Riddle', cipher: 'Cipher', pattern: 'Pattern' } as const;

function TileRow({ text }: { text: string }) {
  return (
    <div className="tiles" role="img" aria-label={text.split('').join(' ')}>
      {text.split('').map((letter, index) => (
        <span key={index} className="tile">
          {letter}
        </span>
      ))}
    </div>
  );
}

function CipherNote({ stage }: { stage: CipherStage }) {
  return (
    <div className="note">
      {stage.crib && (
        <div className="note-word">
          <p className="note-label">First word, which means {stage.crib.plain}</p>
          <TileRow text={stage.crib.text} />
        </div>
      )}
      <div className="note-word">
        <p className="note-label">{stage.crib ? 'Second word, to decode' : 'The word to decode'}</p>
        <TileRow text={stage.cipher} />
      </div>
    </div>
  );
}

function PatternTiles({ tiles }: { tiles: string[] }) {
  return (
    <div className="tiles" role="img" aria-label={tiles.map((t) => (t === '?' ? 'blank' : t)).join(', ')}>
      {tiles.map((tile, index) => (
        <span key={index} className={`tile tile-auto${tile === '?' ? ' tile-blank' : ''}`}>
          {tile}
        </span>
      ))}
    </div>
  );
}

export function Stage({ stage, stageNumber, stageCount, progress, onSubmit, onHint }: Props) {
  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousWrong = useRef(progress.wrong);

  // On a phone, focus opens the keyboard, which would cover the cipher help.
  const focusOnArrival = stage.type !== 'cipher';
  useEffect(() => {
    if (focusOnArrival) inputRef.current?.focus();
  }, [focusOnArrival]);

  useEffect(() => {
    if (progress.wrong > previousWrong.current) {
      setShaking(true);
      inputRef.current?.select();
    }
    previousWrong.current = progress.wrong;
  }, [progress.wrong]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(answer);
  };

  const nextHint = progress.hints;
  const hintsLeft = nextHint < HINT_COST.length;
  const hintLabel = nextHint === HINT_COST.length - 1 ? 'Show the answer' : `Take hint ${nextHint + 1}`;

  return (
    <main className="screen">
      <p className="eyebrow">
        Stage {stageNumber} of {stageCount}: {STAGE_LABEL[stage.type]}
      </p>
      <h1 className="prompt">{stage.prompt}</h1>

      {stage.type === 'cipher' && <CipherNote stage={stage} />}
      {stage.type === 'pattern' && <PatternTiles tiles={stage.tiles} />}

      {stage.type === 'cipher' && (
        <details className="howto" open>
          <summary>How this works</summary>
          <p>{cipherHowTo[stage.kind]}</p>
        </details>
      )}

      <form className="answer-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="answer">
          Your answer
        </label>
        <input
          id="answer"
          ref={inputRef}
          className={`answer-input${shaking ? ' shake' : ''}`}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onAnimationEnd={() => setShaking(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
        />
        <p className="feedback" role="status">
          {progress.wrong > 0 && `That is not it. Wrong answers so far: ${progress.wrong}. They cost nothing.`}
        </p>
        <button className="button" type="submit">
          Submit
        </button>
      </form>

      <section className="hints" aria-label="Hints">
        <p className="muted">This stage is worth {scoreStage(progress.hints)} points.</p>
        {progress.hints > 0 && (
          <ol className="hint-list">
            {stage.hints.slice(0, progress.hints).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        )}
        {hintsLeft && (
          <button className="button button-secondary" type="button" onClick={onHint}>
            {hintLabel} (costs {HINT_COST[nextHint]} points)
          </button>
        )}
      </section>
    </main>
  );
}
