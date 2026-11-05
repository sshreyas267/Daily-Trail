import { describe, expect, it } from 'vitest';
import reference from '../../reference/hunts.json';
import { atbash, caesar, checkAnswer, decodeText, pairSwap } from '../engine';
import { cipherHowTo, hunts, practiceHunts } from './hunts';

const allHunts = [
  ...hunts.map((hunt) => ['daily', hunt.day, hunt, reference.hunts] as const),
  ...practiceHunts.map((hunt) => ['practice', hunt.day, hunt, reference.practice] as const),
];

describe.each(allHunts)('%s hunt %i', (_kind, _number, hunt, source) => {
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
      expect(stage.hints[2]).toBe(`The answer is ${stage.answer}.`);
      // Single letters are skipped, except a one-letter answer, because they match ordinary words like "a".
      const giveaways = [stage.answer, ...stage.accept].filter(
        (word) => word.length > 1 || word === stage.answer.toLowerCase(),
      );
      for (const hint of stage.hints.slice(0, 2)) {
        for (const word of giveaways) {
          expect(hint).not.toMatch(new RegExp(`\\b${word}\\b`, 'i'));
        }
      }
    }
  });

  it('has cipher hints that follow the rule: find the code, then decode the first letter', () => {
    if (cipher.crib) expect(cipher.hints[0]).toContain(`${cipher.crib.text} is really THE`);
    if (cipher.kind === 'pairswap') {
      expect(cipher.hints[0]).toContain('swap');
      expect(cipher.hints[1]).toContain(`starts with ${cipher.answer[0]}`);
    } else {
      expect(cipher.hints[1]).toContain(`${cipher.cipher[0]}, decodes to ${cipher.answer[0]}`);
    }
  });

  it('matches the reference data', () => {
    const match = source.find((item) => item.day === hunt.day);
    const withoutHints = hunt.stages.map(({ hints: _hints, ...stage }) => stage);
    expect(match?.word).toBe(hunt.word);
    expect(withoutHints).toEqual(match?.stages);
  });
});

describe('hunt list', () => {
  it('has three practice hunts numbered 1 to 3, with answers not used by any daily hunt', () => {
    expect(practiceHunts.map((hunt) => hunt.day)).toEqual([1, 2, 3]);
    const daily = new Set(hunts.flatMap((hunt) => [hunt.word, ...hunt.stages.map((stage) => stage.answer)]));
    for (const hunt of practiceHunts) {
      expect(daily.has(hunt.word)).toBe(false);
      for (const stage of hunt.stages) expect(daily.has(stage.answer)).toBe(false);
    }
  });

  it('has seven hunts numbered 1 to 7', () => {
    expect(hunts.map((hunt) => hunt.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('matches the reference cipher help text', () => {
    expect(cipherHowTo).toEqual(reference.cipherHowTo);
  });
});

describe('cipher help text', () => {
  it('explains that the alphabet loops', () => {
    expect(cipherHowTo.caesar.steps.join(' ')).toContain('Z is followed by A');
  });

  it('has worked examples that are correct', () => {
    expect(caesar('THE', 1)).toBe('UIF');
    expect(decodeText({ kind: 'caesar', shift: 1 }, 'DBU')).toBe('CAT');
    expect(cipherHowTo.caesar.example).toContain('THE is written UIF');
    expect(cipherHowTo.caesar.example).toContain('DBU decodes to CAT');
    expect(atbash('XZG')).toBe('CAT');
    expect(cipherHowTo.atbash.example).toContain('XZG decodes to CAT');
    expect(pairSwap('OBTA')).toBe('BOAT');
    expect(cipherHowTo.pairswap.example).toContain('OB TA becomes BO AT');
  });

  it('has a mirror chart in which each letter sits with its partner', () => {
    const [top, bottom] = (cipherHowTo.atbash.chart ?? []).map((row) => row.split(' '));
    expect(top).toHaveLength(13);
    top.forEach((letter, index) => expect(atbash(letter)).toBe(bottom[index]));
  });
});
