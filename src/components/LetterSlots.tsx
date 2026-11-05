type Props = { letters: (string | null)[] };

export function LetterSlots({ letters }: Props) {
  const found = letters.filter(Boolean).length;
  return (
    <div
      className="slots"
      role="img"
      aria-label={`Treasure word: ${found} of ${letters.length} letters found. ${letters.map((l) => l ?? 'blank').join(', ')}`}
    >
      {letters.map((letter, index) => (
        <span key={index} className={`tile slot${letter ? ' slot-found' : ''}`}>
          {letter ?? ''}
        </span>
      ))}
    </div>
  );
}
