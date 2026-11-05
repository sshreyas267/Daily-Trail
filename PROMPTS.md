# Prompts and changes

## Setup
**Asked:** Review the build guide, find where it can be simplified or improved, and ask questions before building.

**Changed:** Created CLAUDE.md, reference/hunts.json, reference/events.md and this file. Compared with the guide: separated the day number from the puzzle number, added saved progress and a date override, added wrap-around to the cipher help, and replaced some puzzle content (Day 5 is now OAR, with new riddles on Days 2 and 7). Dropped the return_visit event, because hunt_viewed now carries days_since_last.

## Phase 1: Scaffold, tokens, puzzle engine
**Asked:** Scaffold a Vite React TypeScript project, add light and dark design tokens and fonts, load Day 1 into src/data/hunts.ts, build the answer, scoring and cipher engine, and test it. No screens yet.

**Changed:** Added the project config, src/styles/tokens.css, src/data/hunts.ts (types, cipher help text and Day 1 with hints), and src/engine (normalizeAnswer, checkAnswer, scoreStage, caesar, atbash, pairSwap, decodeText). Tests cover normalization, accepted variants, scoring after 0 to 3 hints, and that every cipher decodes to its answer. A word that is only an article, such as "a", is kept because it can be a real answer. Tests have their own vitest.config.ts. Vitest is on 5.x because the older version npm first installed had critical audit findings.

Tooling note: npm 10.9.2 crashes while resolving peer dependencies for this dependency set, so the lockfile was generated with `npx npm@11 install`. Adding a package needs the same command. Installing from the existing lockfile works on npm 10.

## Phase 2: Game screens
**Asked:** Build Intro, Stage, StageFound and Result with a reducer for game state. Include the timer, three hints with costs, the wrong-answer shake, letters filling three slots, the chest opening, and the "How this works" panel on cipher stages. Keep the share card and leaderboard as placeholders.

**Changed:** Added src/game (reducer and selectors, with tests) and src/components. Checked by playing Day 1 in a real browser at 360px and 400px, in light and dark. Three problems showed up in the screenshots and were fixed: the cipher help sat below the fold under the hint button, so it moved above the answer box and the input no longer takes focus on arrival on cipher stages; the chest lid was clipped and the chest was white in dark mode; the score wrapped at 360px. The timer keeps running on the "You found the letter" screen. Saved progress waits for Phase 3 with the storage module.
