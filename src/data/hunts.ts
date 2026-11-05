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

export type CipherHowTo = {
  name: string;
  summary: string;
  chart?: string[];
  steps: string[];
  example: string;
};

export const cipherHowTo: Record<CipherKind, CipherHowTo> = {
  "caesar": {
    "name": "Shift code",
    "summary": "Every letter moved forward by the same number of places.",
    "steps": [
      "The first word is THE. Count forward from T to the first letter you see. That tells you how many places.",
      "Move each letter of the second word back by that many places.",
      "The alphabet loops, so Z is followed by A."
    ],
    "example": "Example: if THE is written UIF, every letter moved 1 place. So DBU decodes to CAT."
  },
  "atbash": {
    "name": "Mirror code",
    "summary": "The alphabet was flipped, so each letter swapped with its partner in this chart.",
    "chart": [
      "A B C D E F G H I J K L M",
      "Z Y X W V U T S R Q P O N"
    ],
    "steps": [
      "Find each letter of the second word in the chart.",
      "Swap it for the letter directly above or below it.",
      "Try this on the first word. It should give THE."
    ],
    "example": "Example: XZG decodes to CAT."
  },
  "pairswap": {
    "name": "Swap code",
    "summary": "Each pair of letters was swapped.",
    "steps": [
      "Split the word into pairs of letters, starting from the left.",
      "Swap the two letters in each pair."
    ],
    "example": "Example: OB TA becomes BO AT, which spells BOAT."
  }
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
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'WKH', plain: 'THE' },
        cipher: 'HPHUDOG',
        answer: 'EMERALD',
        accept: ['emerald'],
        hints: [
          'WKH is really THE. Count the places from T forward to W. That is how many places each letter moved.',
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
  {
    day: 2,
    word: 'MAP',
    stages: [
      {
        type: 'riddle',
        prompt: 'I shine at night with no light of my own, and I pull the tides without touching them. What am I?',
        answer: 'MOON',
        accept: ['moon'],
        hints: [
          'Look up on a clear night.',
          'I orbit the Earth, and I start with M.',
          'The answer is MOON.',
        ],
      },
      {
        type: 'cipher',
        kind: 'atbash',
        prompt:
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'GSV', plain: 'THE' },
        cipher: 'ZMXSLI',
        answer: 'ANCHOR',
        accept: ['anchor'],
        hints: [
          'GSV is really THE. T is 7th from the end of the alphabet and G is 7th from the start. Every letter flips this way.',
          'The first letter of the second word, Z, decodes to A.',
          'The answer is ANCHOR.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['M', 'V', 'E', 'M', 'J', 'S', 'U', 'N', '?'],
        answer: 'PLUTO',
        accept: ['pluto', 'p'],
        hints: [
          'Each letter starts the name of something that moves around the Sun.',
          'These are the planets in order from the Sun, using the old nine-planet list.',
          'The answer is PLUTO.',
        ],
      },
    ],
  },
  {
    day: 3,
    word: 'SUN',
    stages: [
      {
        type: 'riddle',
        prompt: 'I follow you everywhere, but I vanish in the dark. What am I?',
        answer: 'SHADOW',
        accept: ['shadow'],
        hints: [
          'You see me most clearly on a sunny day.',
          'I am the dark shape your body makes on the ground.',
          'The answer is SHADOW.',
        ],
      },
      {
        type: 'cipher',
        kind: 'caesar',
        shift: 5,
        prompt:
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'YMJ', plain: 'THE' },
        cipher: 'ZSIJWXJF',
        answer: 'UNDERSEA',
        accept: ['undersea'],
        hints: [
          'YMJ is really THE. Count the places from T forward to Y. That is how many places each letter moved.',
          'The first letter of the second word, Z, decodes to U.',
          'The answer is UNDERSEA.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['O', 'T', 'T', 'F', 'F', 'S', 'S', 'E', '?'],
        answer: 'NINE',
        accept: ['nine', '9', 'n'],
        hints: [
          'Each letter starts a word you learned when you first learned to count.',
          'One, two, three, four. What comes after eight?',
          'The answer is NINE.',
        ],
      },
    ],
  },
  {
    day: 4,
    word: 'RAT',
    stages: [
      {
        type: 'riddle',
        prompt: 'I have a mouth but never speak, and a bed but never sleep. What am I?',
        answer: 'RIVER',
        accept: ['river'],
        hints: [
          'I am always moving, and I usually end at the sea.',
          'Boats travel along me. The Nile and the Amazon are two of my kind.',
          'The answer is RIVER.',
        ],
      },
      {
        type: 'cipher',
        kind: 'caesar',
        shift: 4,
        prompt:
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'XLI', plain: 'THE' },
        cipher: 'EVQEHE',
        answer: 'ARMADA',
        accept: ['armada'],
        hints: [
          'XLI is really THE. Count the places from T forward to X. That is how many places each letter moved.',
          'The first letter of the second word, E, decodes to A.',
          'The answer is ARMADA.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['DO', 'RE', 'MI', 'FA', 'SO', 'LA', '?'],
        answer: 'TI',
        accept: ['ti', 'te'],
        hints: [
          'Try singing these out loud.',
          'This is the musical scale. One more note comes before DO again.',
          'The answer is TI.',
        ],
      },
    ],
  },
  {
    day: 5,
    word: 'OAR',
    stages: [
      {
        type: 'riddle',
        prompt: 'I have three hearts, eight arms and no bones. What am I?',
        answer: 'OCTOPUS',
        accept: ['octopus'],
        hints: [
          'I live in the sea and I can squirt ink.',
          'My name comes from the Greek for eight feet, and I start with O.',
          'The answer is OCTOPUS.',
        ],
      },
      {
        type: 'cipher',
        kind: 'caesar',
        shift: 13,
        prompt:
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'GUR', plain: 'THE' },
        cipher: 'NGYNAGVF',
        answer: 'ATLANTIS',
        accept: ['atlantis'],
        hints: [
          'GUR is really THE. Count the places from T forward to G, carrying on from A after Z. That is how many places each letter moved.',
          'The first letter of the second word, N, decodes to A.',
          'The answer is ATLANTIS.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['Q', 'W', 'E', '?'],
        answer: 'R',
        accept: ['r'],
        hints: [
          'Look closely at whatever you type on.',
          'These are the letters along the top row of a keyboard, from the left.',
          'The answer is R.',
        ],
      },
    ],
  },
  {
    day: 6,
    word: 'ELF',
    stages: [
      {
        type: 'riddle',
        prompt: 'I speak without a mouth and answer only when you call. What am I?',
        answer: 'ECHO',
        accept: ['echo'],
        hints: [
          'You might hear me in a cave or a canyon.',
          'Shout hello in the mountains and I say it back to you.',
          'The answer is ECHO.',
        ],
      },
      {
        type: 'cipher',
        kind: 'pairswap',
        prompt: 'A pirate sent a coded note. Decode the word. That is your answer.',
        cipher: 'ALOGNO',
        answer: 'LAGOON',
        accept: ['lagoon'],
        hints: [
          'Split the word into pairs of letters from the left, then swap the two letters in each pair.',
          'The first pair is AL, so the word starts with L.',
          'The answer is LAGOON.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'What comes next?',
        tiles: ['SUN', 'MON', 'TUE', 'WED', 'THU', '?'],
        answer: 'FRI',
        accept: ['fri', 'friday', 'f'],
        hints: [
          'Think of the top of a wall calendar.',
          'These are short names for the days of the week. Which day follows Thursday?',
          'The answer is FRI.',
        ],
      },
    ],
  },
  {
    day: 7,
    word: 'KEY',
    stages: [
      {
        type: 'riddle',
        prompt: 'I fly without wings, and a string stops me from getting away. What am I?',
        answer: 'KITE',
        accept: ['kite'],
        hints: [
          'I need a windy day to get off the ground.',
          'People hold my string at the park or the beach, and I start with K.',
          'The answer is KITE.',
        ],
      },
      {
        type: 'cipher',
        kind: 'caesar',
        shift: 7,
        prompt:
          'A pirate sent a coded note. Decode the second word. That is your answer.',
        crib: { text: 'AOL', plain: 'THE' },
        cipher: 'LEWSVYLY',
        answer: 'EXPLORER',
        accept: ['explorer'],
        hints: [
          'AOL is really THE. Count the places from T forward to A, carrying on from A after Z. That is how many places each letter moved.',
          'The first letter of the second word, L, decodes to E.',
          'The answer is EXPLORER.',
        ],
      },
      {
        type: 'pattern',
        prompt: 'Which colour is missing?',
        tiles: ['R', 'O', '?', 'G', 'B', 'I', 'V'],
        answer: 'YELLOW',
        accept: ['yellow', 'y'],
        hints: [
          'Each letter starts the name of a colour.',
          'Think of a rainbow: red, orange, then which colour comes before green?',
          'The answer is YELLOW.',
        ],
      },
    ],
  },
];
