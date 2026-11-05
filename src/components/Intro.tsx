type Props = { huntNumber: number; onStart: () => void };

export function Intro({ huntNumber, onStart }: Props) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="screen screen-center">
      <h1 className="wordmark">Daily Trail</h1>
      <p className="muted">
        {today}. Hunt #{huntNumber}.
      </p>
      <p className="lede">Solve three puzzles. Each answer gives you one letter of the treasure word.</p>
      <ol className="rules">
        <li>Solve a riddle, a cipher and a pattern.</li>
        <li>Each stage is worth 100 points. Hints cost points, and wrong answers cost nothing.</li>
        <li>The timer starts when you press Start.</li>
      </ol>
      <button className="button" type="button" onClick={onStart}>
        Start
      </button>
    </main>
  );
}
