# Daily Trail

A daily treasure hunt for people who love puzzles. Everyone gets the same hunt each day: a riddle, a cipher and a pattern. Each answer gives one letter, and the three letters spell the treasure word.

**Play it:** https://dailytrail.vercel.app/

**Metrics plan:** [docs/Daily-Trail-Metrics-Plan.pdf](docs/Daily-Trail-Metrics-Plan.pdf) is the version for management. It lists what we track, what we would do when a number looks wrong, and how results are reported. [docs/METRICS.md](docs/METRICS.md) has the same plan in plain text.

**How the code works:** [docs/GUIDE.md](docs/GUIDE.md) explains how a play works and what each part of the code does, in plain terms.

**How it was built:** [PROMPTS.md](PROMPTS.md) records what was asked and what changed in each phase.

## Why it is built this way

The goal is a daily habit, and each feature supports it:

- **One shared hunt a day** gives players a reason to return and something to compare.
- **Hints that cost points** let anyone finish, while a clean solve still means something.
- **A streak with one weekly freeze** rewards regular play without punishing one missed day.
- **A spoiler-free share card** lets players compare results without giving away the answers.

## Run it

Needs Node 22.12 or newer.

```
npm install
npm run dev       # Local dev server
npm test          # Unit tests
npm run build     # Type check and production build
```

To add a package, use `npx npm@11 install <package>`. npm 10 crashes while resolving this project's peer dependencies, though installing from the existing lockfile works.

## Test overrides

Players and testers can also play beyond the one daily hunt:

- **Practice hunts:** after finishing, "Play more hunts" offers three practice hunts. They are separate from the seven daily hunts, so they never spoil a future day.
- **Past hunts:** the intro and result screens list the daily hunts a player has finished, with their squares, score and time. Each one can show its answers or be played again. If a past hunt is today's puzzle again, its answers stay hidden until today's hunt is finished.

Practice plays and replays never change the streak, score or daily lock. To see a longer list of past hunts, play a few test dates with `?date=`. The overrides below work on the live site too.

| Add to the URL | What it does |
|---|---|
| `?day=N` | Shows puzzle N. It never changes the real streak, daily lock or score. |
| `?date=YYYY-MM-DD` | Plays as if it were that date, in separate saved state, so streaks can be tested. |
| `?practice=N` | Plays practice hunt N, from 1 to 3. |
| `?replay=N` | Plays the daily hunt from day N again. |
| `?reset=1` | Clears local state, then removes itself from the URL. |

## How the code is organised

| Folder | What it holds |
|---|---|
| `src/data` | The seven daily hunts, three practice hunts and the cipher help text. All puzzle content lives here. |
| `src/engine` | Pure logic: answers, scoring, ciphers, dates, streaks, share text and the leaderboard. |
| `src/game` | The game reducer, saved sessions and the events each action fires. |
| `src/components` | The screens. They contain no puzzle logic. |
| `src/analytics` | `track()`, the only route for recording user actions. |
| `src/storage` | The only code that touches localStorage. |
| `src/styles` | Design tokens and app styles for light and dark mode. |
| `reference` | The source puzzle data and the event definitions. |

Every puzzle has a unit test proving that its cipher text decodes to its answer.

## What is real and what is not

- **Leaderboard:** only the player's row is real. The other 12 players are generated from the day number, and the screen says so.
- **Player data:** there is no backend. Progress and events stay in each player's browser, so no real metrics exist across players yet. The Event log link on the screen shows a player's own events and can export them as JSON.
- **Metric goals:** goals for players coming back use published game industry numbers. Every other goal will be set from the game's own first two weeks of real data. None of them are results.
- **Content:** the seven hunts repeat every seven days, so a longer run needs more puzzles.
- **Metrics dashboard:** this was optional and has not been built.

## What we would build next

1. Send events to an analytics service, because the metrics plan depends on it.
2. Add more hunts, so returning players do not see repeats after the first week.
3. Add crews, so small groups can play and compare together.
4. Let community members submit puzzles.
5. Add a monthly story map that links the daily hunts together.
