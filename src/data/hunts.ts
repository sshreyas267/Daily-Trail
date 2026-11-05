export type CipherKind = 'caesar' | 'atbash' | 'pairswap';
export type Hints = [string, string, string];

type StageBase = {
  prompt: string;
  answer: string;
  accept: string[];
  hints: Hints;
};

export type RiddleStage = StageBase & { type: 'riddle' };
export type PatternStage = StageBase & { type: 'pattern'; tiles: string[] };
export type CipherStage = StageBase & {
  type: 'cipher';
  kind: CipherKind;
  shift?: number;
  crib?: { text: string; plain: string };
  cipher: string;
};

export type Stage = RiddleStage | CipherStage | PatternStage;

export type Hunt = {
  day: number;
  word: string;
  stages: [RiddleStage, CipherStage, PatternStage];
};

export const cipherHowTo: Record<CipherKind, string> = {
  caesar:
    'Shift code. Every letter in the note moved forward by the same number of places in the alphabet. After Z, counting carries on from A. Step 1: the first word is really THE. Count how many places T moved to become the first letter shown. Step 2: move every letter of the second word back by that many places. Worked example with a shift of 1: CAT is written DBU. To decode DBU, move each letter back 1.',
  atbash:
    'Mirror code. The alphabet was flipped: A became Z, B became Y, C became X, and so on until Z became A. The first word is really THE, so you can check the flip on it first. Flip every letter of the second word the same way to decode it. Worked example: CAT is written XZG. To decode XZG, flip each letter back.',
  pairswap:
    'Swap code. The letters were swapped in pairs: the 1st with the 2nd, the 3rd with the 4th, and so on. Swap each pair back to decode the word. Worked example: BOAT is written OBTA.',
};

export const hunts: Hunt[] = [
  {
    day: 1,
    word: 'SEA',
    stages: [
      {
        type: 'riddle',
        prompt: "I'm full of holes, yet I can hold water. What am I?",
        answer: 'SPONGE',
        accept: ['sponge'],
        hints: [
          'You would find me in a kitchen or a bathroom.',
          'People squeeze me to get the water out, and I start with S.',
          'The answer is SPONGE.',
        ],
      },
      {
        type: 'cipher',
        kind: 'caesar',
        shift: 3,
        prompt:
          'A pirate sent a coded note. Use the first word to crack the code, then decode the second word.',
        crib: { text: 'WKH', plain: 'THE' },
        cipher: 'HPHUDOG',
        answer: 'EMERALD',
        accept: ['emerald'],
        hints: [
          'WKH is really THE. Count the places from T forward to W. That is the shift.',
          'The first letter of the second word, H, decodes to E.',
          'The answer is EMERALD.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['J', 'F', 'M', 'A', 'M', 'J', 'J', '?'],
        answer: 'AUGUST',
        accept: ['august', 'aug', 'a'],
        hints: [
          'Each letter starts a word in a list of twelve.',
          'January, February, March. Which month follows July?',
          'The answer is AUGUST.',
        ],
      },
    ],
  },
];
