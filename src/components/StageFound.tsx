import { useEffect, useRef } from 'react';

type Props = {
  answer: string;
  letter: string;
  points: number;
  isLastStage: boolean;
  onContinue: () => void;
};

export function StageFound({ answer, letter, points, isLastStage, onContinue }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <main className="screen screen-center">
      <h1 className="heading">You found the letter {letter}</h1>
      <p className="lede">The answer was {answer}.</p>
      <p className="points">+{points} points</p>
      <button ref={buttonRef} className="button" type="button" onClick={onContinue}>
        {isLastStage ? 'Open the chest' : 'Next stage'}
      </button>
    </main>
  );
}
