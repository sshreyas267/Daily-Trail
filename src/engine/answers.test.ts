import { describe, expect, it } from 'vitest';
import { checkAnswer, normalizeAnswer } from './answers';

describe('normalizeAnswer', () => {
  it.each([
    ['SPONGE', 'sponge'],
    ['  Sponge  ', 'sponge'],
    ['sponge!', 'sponge'],
    ["don't", 'dont'],
    ['a sponge', 'sponge'],
    ['An anchor', 'anchor'],
    ['the map.', 'map'],
    ['THE   BIG   map', 'big map'],
  ])('turns %j into %j', (input, expected) => {
    expect(normalizeAnswer(input)).toBe(expected);
  });

  it('keeps a word that is only an article, because "a" can be a real answer', () => {
    expect(normalizeAnswer('a')).toBe('a');
    expect(normalizeAnswer('A.')).toBe('a');
    expect(normalizeAnswer('the')).toBe('the');
  });

  it('does not strip an article from inside a longer word', () => {
    expect(normalizeAnswer('anchor')).toBe('anchor');
    expect(normalizeAnswer('atlantis')).toBe('atlantis');
    expect(normalizeAnswer('then')).toBe('then');
  });
});

describe('checkAnswer', () => {
  const stage = { accept: ['august', 'aug', 'a'] };

  it.each(['august', 'AUGUST', ' Aug. ', 'a', 'A', 'the august'])('accepts %j', (input) => {
    expect(checkAnswer(stage, input)).toBe(true);
  });

  it.each(['july', 'augustus', '', '   ', '!!!'])('rejects %j', (input) => {
    expect(checkAnswer(stage, input)).toBe(false);
  });

  it('accepts digits when listed', () => {
    expect(checkAnswer({ accept: ['nine', '9', 'n'] }, '9')).toBe(true);
  });
});
