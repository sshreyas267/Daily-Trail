import type { CipherStage } from '../data/hunts';

const mapLetters = (text: string, map: (index: number) => number): string =>
  text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + map(char.charCodeAt(0) - base));
  });

/** Moves each letter forward by shift. Use a negative shift to decode. */
export function caesar(text: string, shift: number): string {
  return mapLetters(text, (index) => (((index + shift) % 26) + 26) % 26);
}

export function atbash(text: string): string {
  return mapLetters(text, (index) => 25 - index);
}

/** Swaps the 1st with the 2nd letter, the 3rd with the 4th, and so on. */
export function pairSwap(text: string): string {
  return text.replace(/(.)(.)/g, '$2$1');
}

export function decodeText(stage: Pick<CipherStage, 'kind' | 'shift'>, text: string): string {
  switch (stage.kind) {
    case 'caesar':
      return caesar(text, -(stage.shift ?? 0));
    case 'atbash':
      return atbash(text);
    case 'pairswap':
      return pairSwap(text);
  }
}
