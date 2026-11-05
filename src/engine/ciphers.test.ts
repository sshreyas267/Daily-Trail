import { describe, expect, it } from 'vitest';
import { atbash, caesar, decodeText, pairSwap } from './ciphers';

describe('cipher helpers', () => {
  it('shifts forward and back, and wraps past Z', () => {
    expect(caesar('CAT', 1)).toBe('DBU');
    expect(caesar('DBU', -1)).toBe('CAT');
    expect(caesar('T', 7)).toBe('A');
    expect(caesar('A', -7)).toBe('T');
  });

  it('flips the alphabet', () => {
    expect(atbash('CAT')).toBe('XZG');
    expect(atbash('XZG')).toBe('CAT');
  });

  it('swaps pairs and leaves an odd last letter in place', () => {
    expect(pairSwap('BOAT')).toBe('OBTA');
    expect(pairSwap('OBTA')).toBe('BOAT');
    expect(pairSwap('ABC')).toBe('BAC');
  });

  it('decodes by cipher kind', () => {
    expect(decodeText({ kind: 'caesar', shift: 1 }, 'DBU')).toBe('CAT');
    expect(decodeText({ kind: 'atbash' }, 'XZG')).toBe('CAT');
    expect(decodeText({ kind: 'pairswap' }, 'OBTA')).toBe('BOAT');
  });
});
