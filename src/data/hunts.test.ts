import { describe, expect, it } from 'vitest';
import { checkAnswer, decodeText } from '../engine';
import { cipherHowTo, hunts } from './hunts';

describe.each(hunts.map((hunt) => [hunt.day, hunt] as const))('hunt for day %i', (_day, hunt) => {
  const [, cipher] = hunt.stages;

  it('has cipher text that decodes to its answer', () => {
    expect(decodeText(cipher, cipher.cipher)).toBe(cipher.answer);
  });

  it('has a first word that decodes to THE when one is shown', () => {
    if (cipher.crib) expect(decodeText(cipher, cipher.crib.text)).toBe(cipher.crib.plain);
  });

  it('spells the treasure word from the first letters of its answers', () => {
    expect(hunt.stages.map((stage) => stage.answer[0]).join('')).toBe(hunt.word);
  });

  it('accepts the answer of every stage', () => {
    for (const stage of hunt.stages) expect(checkAnswer(stage, stage.answer)).toBe(true);
  });

  it('has a third hint that shows the answer, and earlier hints that do not', () => {
    for (const stage of hunt.stages) {
      expect(stage.hints[2]).toContain(stage.answer);
      expect(stage.hints[0].toUpperCase()).not.toContain(stage.answer);
      expect(stage.hints[1].toUpperCase()).not.toContain(stage.answer);
    }
  });
});

describe('cipher help text', () => {
  it('explains wrapping past Z in the shift code', () => {
    expect(cipherHowTo.caesar).toContain('After Z');
  });

  it('has worked examples that are correct', () => {
    expect(decodeText({ kind: 'caesar', shift: 1 }, 'DBU')).toBe('CAT');
    expect(cipherHowTo.caesar).toContain('CAT is written DBU');
    expect(cipherHowTo.atbash).toContain('CAT is written XZG');
    expect(cipherHowTo.pairswap).toContain('BOAT is written OBTA');
  });
});
