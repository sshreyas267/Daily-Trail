import { describe, expect, it } from 'vitest';
import { hunts } from '../data/hunts';
import { buildShareText, squareFor } from './share';

describe('squareFor', () => {
  it.each([
    [0, '🟩'],
    [1, '🟨'],
    [2, '🟨'],
    [3, '⬛'],
  ])('after %i hints is %s', (hints, square) => {
    expect(squareFor(hints)).toBe(square);
  });
});

const input = { dayNumber: 12, stageHints: [0, 2, 3], secs: 125, streak: 4, url: 'https://example.test/' };

describe('buildShareText', () => {
  it('has the hunt number, squares, words, time, streak and link, in order', () => {
    expect(buildShareText(input)).toBe(
      'Daily Trail #12\n🟩🟨⬛\nTreasure found\nTime 2:05. Streak 4.\nhttps://example.test/',
    );
  });

  it('leaves out the streak when the play has none', () => {
    expect(buildShareText({ ...input, streak: null })).toContain('Time 2:05.\n');
  });

  it.each(hunts.map((hunt) => [hunt.word, hunt] as const))('gives nothing away for %s', (_word, hunt) => {
    const text = buildShareText(input).toUpperCase();
    expect(text).not.toMatch(new RegExp(`\\b${hunt.word}\\b`));
    for (const stage of hunt.stages) {
      if (stage.answer.length > 1) expect(text).not.toMatch(new RegExp(`\\b${stage.answer}\\b`));
    }
  });
});
