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

## Phase 5: Share card and leaderboard
**Asked:** Build the real result screen. Share text with the hunt number, one square per stage, "Treasure found", time and streak, plus a Copy button with a selectable fallback. Leaderboard of 12 seeded players per day plus the player, ranked by score then time, labelled as sample data.

**Changed:** Added src/engine/share.ts and leaderboard.ts, and the ShareCard and Leaderboard components. The share text also carries a link to the game, and phones get the native share sheet with Copy alongside it. Closing the share sheet records nothing, and a failed share falls back to Copy. share_copied now fires with a method of share, copy or manual. Seeded players depend only on the day number and player index, so the board is stable on reload and differs when a puzzle repeats. The "This week" toggle was dropped as agreed. Tests confirm the share text never contains an answer or the treasure word.

## Metrics doc and leaderboard tuning
**Asked:** Write the metrics document the brief requires, for management, covering what to track and what to do when a number moves. Also soften the sample leaderboard so a player who takes hints is not always near the bottom.

**Changed:** Added docs/METRICS.md with one main number (weekly active solvers), metric definitions with starting targets, a decision table, cautions for reading the numbers, and the measurement gaps. It says plainly that no real player data exists yet and that the targets are assumptions. Rebalanced the sample scores: a 205 now places around 7th of 13, a 300 stays at or near the top, and a test holds this in place.

## Phase 7: QA pass and README
**Asked:** Run the QA pass and leave the dashboard out. The agreed checks were 360px and 400px, light and dark, reduced motion, keyboard-only play, no horizontal scroll and visible focus. The README belongs to this phase.

**Changed:** Played all seven hunts in a real browser at 320px, 360px and 400px, in light and dark, with reduced motion at 360px, and ran an automated accessibility scan on hunts 1, 2 and 6. Fixed five problems: the "How this works" toggle was a small tap target (24px, now 44px); the "You" row on the leaderboard had low contrast; the test-mode banner sat outside any page landmark; keyboard focus was dropped on arriving at a cipher stage, and now goes to the heading so a phone keyboard still does not open; and focus was dropped when the answer was shown, and now goes to the answer box. The newest hint now scrolls into view. Added README.md. The dashboard was not built, at the user's request.

## Play more hunts
**Asked:** Add a button that lets people play the other hunts straight away, or come back the next day, so the game can be tested.

**Changed:** The result screen has a "Play more hunts" section that links to all seven hunts. Each opens as a practice play through the existing `?day=N` mode, so it never changes the real streak, score or daily lock. Practice results include a "Back to today's hunt" link. Opening a practice hunt fires a new practice_opened event, added to reference/events.md, along with a practice rate in docs/METRICS.md, since it shows demand for more than one hunt a day. Checked in a browser: finish today's hunt, play another, go back, and the streak and lock are unchanged.

## Practice hunts and past hunts
**Asked:** Create separate puzzles for the daily streak and for practice. Let players come back to look at, or play again, the hunts they finished as part of their streak. Build it quickly without lowering code or puzzle quality.

**Changed:** The "Play more hunts" links to the seven daily puzzles could spoil future days, so they were replaced by three new practice hunts (BOW, TEA, SKI) with their own riddle, cipher and pattern stages and the same content tests. Added a list of past hunts on the intro and result screens, with squares, score, time, a "View answers" toggle and "Play Hunt #N again". Finished daily hunts are saved from now on, and a hunt finished before this change is added when the game opens. If a past hunt is today's puzzle again, its answers stay hidden until today is finished. Practice and replays run through the new `?practice=N` and `?replay=N` modes, in memory only, so they never touch the streak, score or lock, and their results hide the share card and sample leaderboard. Added the trail_answers_viewed event and a kind for practice_opened, and replay and practice rates in docs/METRICS.md. Checked in a browser in light and dark: replay, all three practice hunts, the hidden repeat, layout and accessibility. Both parts went out in one push because they were finished together.

## Metrics plan for management (PDF)
**Asked:** Create a version of the metrics plan for someone on the management team, making sure it covers the brief: the metrics to track, inferences for management, and what works and what doesn't, so the product improves. Then add it to the repository as a PDF.

**Changed:** Added docs/Daily-Trail-Metrics-Plan.pdf, a 7-page A4 document in the game's own look. It opens by mapping each part of the brief to the section that answers it. It then covers the main number, six questions with their metrics and starting targets, what working and not working look like with the change to make for each, the Monday update with a blank template, reading cautions and the gaps to close first. It says up front that no real player data exists yet, and it uses no invented numbers. The README links to it. The content matches docs/METRICS.md.

## Project guide
**Asked:** Write a guide to the project that explains how it works and what each code module does, in simple terms.

**Changed:** Added docs/GUIDE.md. It covers what happens during a play, what is saved in the browser, a tour of every folder and file, one Submit tap traced through the code, the game rules, the ways to open the game, what the tests prove, how to make common changes, and a short glossary. The README links to it.

## Evidence-based metric targets
**Asked:** The percentages in the metrics plan had no real basis. Check for published retention benchmarks, or change how the assumptions are made.

**Changed:** Replaced the targets in docs/METRICS.md and docs/Daily-Trail-Metrics-Plan.pdf. The old retention targets (D1 45%, D7 25%, D30 12%) were close to what the top 50 puzzle games achieve, so they are now about 27%, 7.5% and 2.8%, the top quarter of mobile games in GameAnalytics data, with the typical puzzle game as the lower limit. No reliable public figures were found for the other metrics, so their numbers were removed. They are now set from a baseline of the first 14 days and at least 200 players, or by comparing stages and puzzles with each other, and a change only counts if it is bigger than the margin of error. Both documents list their sources and limits, including that the benchmarks come from installed mobile apps.

## Simpler metrics plan
**Asked:** Keep the language simple. The "what works and what we change" sections were confusing, so explain them first, then put the simpler version in the PDF.

**Changed:** Rewrote docs/METRICS.md and docs/Daily-Trail-Metrics-Plan.pdf in plain words. The green and yellow boxes are replaced by one table under each question: what we see, what it probably means, what we do. Terms such as D1, baseline, clean solve and drop-off became plain phrases, and the sources moved to the end. The metrics and the researched numbers did not change. Both documents now come from the same text, so they match.

## Uneven difficulty mix
**Asked:** Add the idea of varying easy, medium and hard puzzles wherever relevant. It should not simply alternate, and the frequency should change, for example 3 easy days then 1 hard day in one week, and 2 hard, 1 easy, 1 hard and 3 medium days the next.

**Changed:** Added a seventh question to docs/METRICS.md and docs/Daily-Trail-Metrics-Plan.pdf, "Is the mix of easy and hard puzzles right?", with the plan, the user's examples, what to measure and what to do. Also added a matching gap (label puzzles by difficulty and write more of them), a note that the uneven mix would solve the same-weekday problem, and a next step in the README. This is a plan only. The game itself still repeats the same seven unlabelled hunts in order, and the documents say so.

**Follow-up:** The uneven difficulty mix stays as future scope and is not being built. The documents now label it that way, and the README section is now called "Future scope".
