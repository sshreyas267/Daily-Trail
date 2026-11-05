# Daily Trail

A daily treasure-hunt puzzle game for a community of puzzle lovers. This is a take-home assignment. The goal is daily engagement and retention, plus metrics that show what works and what does not.

## The brief
Build a game using vibe coding for a community who loves puzzles and treasure hunts. Jot down the metrics to track, so inferences can be shared with management and we can see what works and what does not. Due Friday morning, Nov 6, 2026.

The game and the metrics doc are the required deliverables. The metrics dashboard is optional and gets built last.

## Stack
Vite, React, TypeScript, plain CSS with design tokens, Vitest. State in localStorage. No backend, no auth. Recharts only on the metrics page, loaded separately from the game. Deploy on Vercel.

## Product rules
- One hunt per local calendar day, the same for everyone. Compare calendar dates, not milliseconds, so daylight saving cannot shift the day.
- Day number = calendar days since START_DATE (2026-11-06) + 1. It keeps increasing and is used on the share card and as the leaderboard seed. Dates before START_DATE count as day 1.
- Puzzle number = the day number wrapped over the 7 seeded hunts. It only picks the puzzle.
- A hunt has 3 stages: riddle, cipher, pattern. Each answer gives one letter, the first letter of the answer. The 3 letters spell the treasure word.
- Each stage is worth 100 points. Hint 1 costs 15, hint 2 costs 25 more, hint 3 costs 40 more and shows the answer. Wrong answers cost nothing and are counted.
- Progress is saved after every action. A reload resumes the hunt with its hints and its original start time.
- Streak: +1 for each day a hunt is finished. Weeks start on Monday in local time. A player holds at most one freeze, and it refills each week. One freeze covers one missed day automatically. Two missed days in a row reset the streak, even across a week boundary.
- Streak changes are applied on app open. A player who has not finished today still sees their streak until the day has passed unplayed.
- Share card is spoiler free: green square for a stage solved with no hint, yellow for one or two hints, black for answer shown, plus time, streak and a link to the game. Use the native share sheet where available, with Copy as the fallback.
- A player who finished today's hunt sees the result screen, not the puzzle.
- Cipher stages show a "How this works" panel with the rule and a worked example, taken from reference/hunts.json.

## Design
There is no prototype file. Build an original look from this description: white background, black pill buttons, square tiles, green and yellow status colors, Libre Franklin for UI and Libre Baskerville for the wordmark and headings. Light and dark mode. Mobile first, works at 360px. No third-party names, logos or artwork.

## Engineering rules
- Puzzle content lives in src/data/hunts.ts. Components contain no puzzle logic.
- All user actions go through track() in src/analytics. Only src/storage touches localStorage.
- Every puzzle has a unit test that proves its cipher text decodes to its answer.
- Metrics calculations are pure functions over events, so simulated and real events use the same code.
- Dev overrides work on the live site. ?day=N shows puzzle N and never changes the real streak, daily lock or score. ?date=YYYY-MM-DD plays as if it were that date, in its own separate state, so streaks can be tested. ?reset=1 clears local state, then removes itself from the URL.
- UI copy: plain sentences, no em dashes, no marketing tone.
- After each phase: run the build and tests, commit with a clear message, and append to PROMPTS.md what was asked and what changed.
- Stay inside the current phase. Do not add features that were not asked for.
