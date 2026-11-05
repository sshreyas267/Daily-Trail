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

## Phase 3: All seven hunts, daily lock, streaks
**Asked:** Load hunts 2 to 7 and write three hints per stage, shown in a table for review. Add today's hunt by date, one play per day, a streak with one automatic freeze per week, a storage module, and the ?day=N and ?reset=1 overrides. Unit test the streak logic. After reviewing the table, the player feedback was to make the cipher stage instructions much simpler.

**Changed:** Added all hunts and hints, with tests that hints 1 and 2 never name the answer and that hunts.ts matches reference/hunts.json. Rewrote the cipher prompt and the "How this works" panel as a short rule, numbered steps and one example, with a chart for the mirror code. Cipher hint 1 now says "how many places each letter moved" to match. Added src/engine/dates.ts and streak.ts, src/storage, src/game/session.ts, saved progress on reload, the ?date= override, and a reload when an old tab comes back on a new day. Checked in a browser: all seven treasure words, resume after reload, the daily lock, a freeze and a broken streak through ?date=, and ?reset=1.

## Phase 4: Analytics
**Asked:** Create track(name, props) and fire every event in reference/events.md, each with a player id, session id, hunt id and timestamp. Keep events under one key, capped at 5000 with the newest kept. Add an "Export events (JSON)" button in an event log drawer, and test each payload.

**Changed:** Added src/analytics/track.ts, src/game/events.ts and the EventLog drawer. Game events fire from one action handler rather than from effects, so React strict mode cannot double them. Streak events and hunt_viewed fire once at app open, hunt_abandoned at most once per session. Events under ?day= and ?date= are marked dev. hunt_viewed reports days_since_last, kept in a last_visit value. Checked on the strict-mode dev server: a hunt with two hints and one wrong answer gives the exact expected sequence, and the export is valid JSON. share_copied is defined and tested here, and gets wired to a button in Phase 5.
